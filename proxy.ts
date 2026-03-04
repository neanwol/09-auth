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

  try {
    // Перевіряємо сесію користувача
    const session = await checkSession();
    const isAuthenticated = !!session;

    // Якщо користувач авторизований і намагається зайти на public route
    if (isAuthenticated && isPublicRoute) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }

    // Якщо користувач не авторизований і намагається зайти на private route
    if (!isAuthenticated && isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // В інших випадках пропускаємо
    return NextResponse.next();
  } catch (error) {
    // У випадку помилки перенаправляємо на login
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};