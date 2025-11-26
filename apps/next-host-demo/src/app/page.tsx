import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to the app group route
  redirect('/home');
}
