// proxy.ts
import { NextRequest, NextResponse } from 'next/server';
import { checkSession } from './lib/api/serverApi';

// Публічні маршрути (доступні без авторизації)
const publicRoutes = ['/sign-in', '/sign-up'];

// Приватні маршрути (тільки для авторизованих)
const privateRoutes = ['/profile', '/notes'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Перевіряємо чи це публічний маршрут
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Перевіряємо чи це приватний маршрут
  const isPrivateRoute = privateRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Якщо маршрут не публічний і не приватний - пропускаємо
  if (!isPublicRoute && !isPrivateRoute) {
    return NextResponse.next();
  }

  // Отримуємо cookies з запиту
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  try {
    let isAuthenticated = false;
    let response = NextResponse.next();

    // Якщо є accessToken - користувач авторизований
    if (accessToken) {
      isAuthenticated = true;
    } 
    // Якщо немає accessToken, але є refreshToken - пробуємо оновити сесію
    else if (refreshToken) {
      try {
        const sessionResponse = await checkSession();
        isAuthenticated = !!sessionResponse;
        
        // ВАЖЛИВО: Перевіряємо чи є нові cookies у відповіді
        const setCookieHeader = sessionResponse.headers?.['set-cookie'];
        
        if (setCookieHeader) {
          // Якщо є нові cookies - додаємо їх до відповіді
          response = NextResponse.next();
          
          // Парсимо та встановлюємо кожну cookie
          const cookies = Array.isArray(setCookieHeader) 
            ? setCookieHeader 
            : [setCookieHeader];
            
          cookies.forEach(cookie => {
            response.headers.append('Set-Cookie', cookie);
          });
        }
      } catch (refreshError) {
        console.error('Session refresh failed:', refreshError);
        isAuthenticated = false;
      }
    }

    // Якщо користувач авторизований і намагається зайти на public route
    if (isAuthenticated && isPublicRoute) {
      response = NextResponse.redirect(new URL('/', request.url));
    }
    // Якщо користувач не авторизований і намагається зайти на private route
    else if (!isAuthenticated && isPrivateRoute) {
      response = NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return response;
  } catch (error) {
    // У випадку помилки перенаправляємо на login для приватних маршрутів
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/notes/:path*',
    '/sign-in',
    '/sign-up',
  ],
};