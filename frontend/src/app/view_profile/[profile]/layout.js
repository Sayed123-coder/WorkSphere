export async function generateMetadata({ params }) {
    const { profile } = await params;  
  return {
    title: `${profile} | WorkSphere`
  }
}

export default function Layout({ children }) {
  return <>{children}</>
}