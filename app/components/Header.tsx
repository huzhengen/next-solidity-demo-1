import Link from "next/link";
import MetaMaskCard from "./connectorCards/MetaMaskCard";


export default function Header() {

  return (
    <div className="border-b-2">
      <header className="container flex justify-between items-center mx-auto h-10">
        <div className="flex items-center gap-4">
          <h1>Logo</h1>

          <div className="flex gap-4">
            <Link href="/">Home</Link>
            <Link href="/createCourse">Create Course</Link>
            <Link href="/buyToken">Buy Token</Link>
          </div>
        </div>

        <MetaMaskCard />
      </header>
    </div>
  )
}