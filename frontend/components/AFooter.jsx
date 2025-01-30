import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MoveUpRight } from 'lucide-react';
import Link from 'next/link';
// import { fa-light fa-square-arrow-up-right } from '@fortawesome/free-solid-svg-iconsLink


const Footer = () => {
    return (
        <div className=' w-full h-[170px] pt-3 bg-white  text-black absolute bottom-0 border-t border-gray-200'>
            <div className="flex items-start justify-between px-20">
                <div className="flex-row gap-4">
                    <h1 className='font-semibold'>Publish with Us</h1>
                    <Link href='' className='font-[50] text-sm mt-2'>Authors Guidelines</Link><br></br>
                    <Link href='' className='font-[50] text-sm'>Peer Review</Link><br></br>
                    <Link href='' className='font-[50] text-sm'>Artical Processing Charges</Link>
                    <Link href='' className='font-[50] text-sm'>Open Access</Link>
                </div>
                <div className="flex-col gap-4">
                    <h1 className='font-semibold'>Other servicess</h1>
                    <Link href='' className='font-[50] text-sm mt-2'>Instructors</Link><br></br>
                    <Link href='' className='font-[50] text-sm'>Societies and Publishing Partners</Link><br></br>
                    <Link href='' className='font-[50] text-sm'>Advertisers</Link><br></br>
                    <Link href='' className='font-[50] text-sm'>Terms & Conditions</Link>
                </div>
                <div className="flex-col gap-4">
                    <h1 className='font-semibold'>Contact</h1>
                    {/* <h1 className='font-[50] text-sm mt-2'>Address</h1> */}
                    <h1 className='font-[50] text-md '>RAME Publishers,</h1>
                    <h1 className='font-[50] text-sm'>33, Mandarkrupa Soc., Narsala Road,
                        Nagpur,
                        <br></br> Maharashtra, India. (440034)</h1>
                    <div className="">
                        <Link href='' className='font-[50] text-sm  '><span className='font-semibold text-decoration '>Email:</span> <span className='hover:underline'>publisher@rame.org.in</span>
                            {/* <MoveUpRight />  */}

                        </Link>
                    </div>
                </div>
                <div className=" gap-4">
                    <h1 className='font-semibold mb-3'>Socials</h1>
                    <div className="flex gap-5">
                        <Link href='' ><img src='/linkedin.png' className='h-[26px] w-[26px]'></img></Link>
                        <Link href='' ><img src='/twitter.png' className='h-[26px] w-[26px]'></img></Link>
                        <Link href='' ><img src='/facebook.png' className='h-[26px] w-[26px]'></img></Link>
                        <Link href='' ><img src='/youtube.png' className='h-[26px] w-[26px]'></img></Link>
                    </div>
                </div>

            </div>
            <div className="absolute w-full bottom-0 text-center p-1 ">© 2025 RAME Publishers. All Rights Reserved.</div>

        </div>
    )
}

export default Footer