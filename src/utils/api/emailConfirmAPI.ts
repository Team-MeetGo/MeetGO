import axios from 'axios';

interface EmailConfirmAPIProps {
  success: boolean;
}

export async function emailConfirmAPI(
  email: string,
  univName: string,
  univCheck: boolean
): Promise<EmailConfirmAPIProps> {
  try {
    const response = await axios.post('https://univcert.com/api/v1/certify', {
      key: process.env.NEXT_PUBLIC_EMAIL_API_KEY,
      email,
      univName,
      univCheck
    });
    return response.data;
  } catch (error) {
    throw new Error('API 호출 실패');
  }
}

export async function schoolConfirmAPI(univName: string): Promise<EmailConfirmAPIProps> {
  try {
    const response = await axios.post('https://univcert.com/api/v1/check', {
      key: process.env.NEXT_PUBLIC_EMAIL_API_KEY,
      univName
    });
    return response.data;
  } catch (error) {
    throw new Error('API 호출 실패');
  }
}

export async function emailCodeAPI(email: string, univName: string, code: number): Promise<EmailConfirmAPIProps> {
  try {
    const response = await axios.post('https://univcert.com/api/v1/certifycode', {
      key: process.env.NEXT_PUBLIC_EMAIL_API_KEY,
      email,
      univName,
      code
    });
    return response.data;
  } catch (error) {
    throw new Error('API 호출 실패');
  }
}
