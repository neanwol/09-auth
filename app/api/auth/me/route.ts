import { NextResponse } from 'next/server';
import { api } from '../../api'; 
import { cookies } from 'next/headers';
import { AxiosError } from 'axios';


export async function GET() {
  const cookieStore = await cookies();


  try {
    const { data } = await api.get('/auth/me', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });


    return NextResponse.json(data);
  } catch (error) {
       const axiosError = error as AxiosError<{ error: string }>;
    return NextResponse.json(
      {
         error: axiosError.response?.data?.error ?? axiosError.message,
      },
       { status: axiosError.status || 500 }
    )
  }
}


