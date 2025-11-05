import Sidebar from "../_components/sidebar-provider";
import { ImageKitProvider } from "@imagekit/next";
export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar>
      <ImageKitProvider
        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}
        // publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!}
      >
        {children}
      </ImageKitProvider>
    </Sidebar>
  );
}
