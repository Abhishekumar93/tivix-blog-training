import Header from "../Header/header";

export default function Layout({ children }: any) {
  return (
    // <div className="w-full float-left bg-gray-200 dark:bg-gray-700">
    <div className="w-full float-left bg-gray-200">
      <Header />
      <main className="overflow-auto" style={{ height: "calc(100vh - 4rem)" }}>
        <div className="w-19/20 mx-auto md:w-3/4 lg:w-1/2 xl:w-2/4">
          {children}
        </div>
      </main>
    </div>
  );
}
