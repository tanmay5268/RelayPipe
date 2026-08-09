import { UserButton } from "@clerk/nextjs";
import { Pattern } from "@/components/examples/c-file-upload-5";
const LogoIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 6H10V10H6V6Z" fill="#F97316" />
    <path d="M14 6H18V10H14V6Z" fill="#F97316" />
    <path d="M6 14H10V18H6V14Z" fill="#F97316" />
    <path d="M14 14H18V18H14V14Z" fill="#F97316" fillOpacity="0.5" />
  </svg>
);
export default async function Project() {
  return (
    <div className=" h-screen w-screen text-black bg-[#2a2a2a]">
      <header className="relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="shrink-0 flex items-center gap-2">
              <LogoIcon />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                RelayPipe
              </span>
            </div>
            <div className="">
              <UserButton />
            </div>
          </div>
        </div>
      </header>
      <main>
        <section className="relative z-10 text-center py-16 sm:py-15 px-4">
          <div className=" flex items-center justify-center max-w-4xl mx-auto">
            <Pattern></Pattern>
          </div>
        </section>
      </main>
    </div>
  );
}
