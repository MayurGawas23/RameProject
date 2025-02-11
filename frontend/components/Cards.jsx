import { ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"



const Card = ({title, desc , link, route,  index}) => {
  return (
    <div className="card bg-whit border-2 shadow-lg   rounded-md h-[200px] w-[450px] "  id={`card-${index + 1}`}    > 

    {/* <div className="card-inner bg-green-300"> */}
        <div className="w-full h-full p-4 bg-white rounded-sm  bordr flex flex-col justify-around">
            <h1 className="font-extrabold text-lg mb-2">{title}</h1>
            <p className="mb-4 text-sm text-gray-600">{desc}</p>
            <Link href={route} className="text-blue-700 text-lg hover:underline cursor-pointer flex items-center gap-1">{link}<ChevronRight className="relative top-[2px]" /></Link>
        </div>
    {/* </div> */}
    </div>
  )
}

export default Card
