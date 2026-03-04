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

    // Якщо є accessToken - користувач авторизований
    if (accessToken) {
      isAuthenticated = true;
    } 
    // Якщо немає accessToken, але є refreshToken - пробуємо оновити сесію
    else if (refreshToken) {
      try {
        const session = await checkSession();
        isAuthenticated = !!session;
        
        // Тут бекенд має встановити нові cookies автоматично
        // (з withCredentials: true)
      } catch (refreshError) {
        console.error('Session refresh failed:', refreshError);
        isAuthenticated = false;
      }
    }

    // Якщо користувач авторизований і намагається зайти на public route
    if (isAuthenticated && isPublicRoute) {
      // Редирект на головну сторінку, а не на /profile
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Якщо користувач не авторизований і намагається зайти на private route
    if (!isAuthenticated && isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // В інших випадках пропускаємо
    return NextResponse.next();
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
    // Обмежуємо тільки потрібними маршрутами
    '/profile/:path*',
    '/notes/:path*',
    '/sign-in',
    '/sign-up',
  ],
};