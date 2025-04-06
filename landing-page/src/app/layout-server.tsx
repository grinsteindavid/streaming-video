import type { Metadata } from "next";
import ClientLayout from "./layout-client";

export const metadata: Metadata = {
  title: "Prime Video - Watch Movies, TV Shows, and More",
  description: "Enjoy exclusive Amazon Originals as well as popular movies and TV shows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClientLayout>{children}</ClientLayout>;
}
