import Header from '@/components/Header'
import React from 'react'

const copyright = () => {
  return (
    <div>
        <Header/>
        <div className="w-[80%] mx-auto p-4">
            <h1 className='font-semibold text-lg mb-1'>Copyright and Licensing Policy</h1>
            <p className='mb-4'>Copyright is an intellectual property right (IPR) which gives the author/creator of a work certain rights to protect the way in which their materials are used. All articles published by RAME Publishers journals will be distributed under the terms and conditions of the Creative Commons Attribution License (CC-BY). So anyone is allowed to copy, distribute, and transmit the article on condition that the original article and source is correctly cited.
The manuscript published in RAME Publishers journal will be copyrighted, so authors are allowed to use their own articles for non-commercial purposes without seeking permission from RAME Publishers. We would like to draw your attention to the protection copyright affords against multiple photocopying by libraries, instructors, and copy centers. The 1976 copyright law provides that photocopies in excess of "fair use" copying cannot be made without authorization by the copyright owner "fair use" meaning single copying for personal use. Accordingly, the Journals authorize personal or educational multiple copying only if a request is made in writing, and the required fee per copy is paid directly to us. Each copy must include a notice of copyright.
It is the policy of RAME Publishers Journals to grant to any reputable publisher the right to reprint any of our articles, but only under the condition that the permission of the author is obtained. We ask that publishers interested in reprinting any material send a request in writing to the Editors.</p>
        
        <h1 className='font-semibold text-lg mb-1'>For Authors</h1>
        <p className='mb-4'>In accepting your manuscript for publication, we wish to acquaint you with our copyright policies and to enlist your cooperation. Copyright protects you from plagiarism and pirating, and ensures that your text cannot be altered without your consent. Copyright also allows you or your publisher to offset expenses in publishing your work by means of royalties. You are of course permitted to reprint your own article at no fee; but we ask that you give us notice of any direct negotiations with publishers regarding the reprinting of an article of yours on which we hold copyright. You are also allowed to post an electronic version of your article on your personal website as long as RAME Publishers copyright is acknowledged; such use does not extend, however, to permission for the host site to repackage any copyrighted material with other electronic content for whatever reason educational, commercial, or otherwise.
        Copyright Transfer Agreement (CTA). Under this form of agreement, the author retains certain re-use rights in their article, but transfers copyright to the publisher. Authors of RAME Publishers Journals has to sign copyright agreement providing for the article to be made available under one of the Creative Commons Licenses in order to meet the terms of open access publication and ensure the widest possible dissemination.</p>
       
       <h1 className='font-semibold text-lg mb-1'>Open Access Licenses</h1>
       <p className='mb-4'>Three layers of licenses CC-BY, CC-BY-NC and CC-BY-NC-ND ensure that the spectrum of rights isn’t just a legal concept. It’s something that the creators of works can understand, their users can understand, and even the Web itself can understand. See the Creative Commons website for more details https://creativecommons.org/licenses/ We aim to provide CC-BY 4.0 license which defines how readers can reuse open access articles published on our platforms. For further information on what the CC BY licence allows, please refer to this page.
       This license lets others distribute, remix, adapt, and build upon your work, even commercially, as long as they credit you for the original creation. This is the most accommodating of licenses offered. Recommended for maximum dissemination and use of licensed materials.</p>
      
        <div className="flex justify-center mb-4">
            <table className='border border-zinc-400 w-[1000px] h-[100px]'>
                <thead className='border border-zinc-400 '>
                    <tr className=''> 
                    <td className='border border-zinc-400  text-center p-2 '>User License</td>
                    <td className='border border-zinc-400 text-center p-2'>Read, Print and Download</td>
                    <td className='border border-zinc-400 text-center p-2'>Redistribute or republish the article (e.g. display in a repository)</td>
                    <td className='border border-zinc-400 text-center p-2'>Translate the article</td>
                    <td className='border border-zinc-400 text-center p-2'>Download for text and data mining purposes</td>
                    <td className='border border-zinc-400 text-center p-2'>Reuse portions or extracts from the article in other works</td>
                    <td className='border border-zinc-400 text-center p-2'>Sell or re-use for commercial purposes</td>
                    </tr>
                    
                </thead>
                <tbody>
                    <tr>
                        <td className='border border-zinc-400 text-center p-2'>CC BY 4.0</td>
                        <td className='border border-zinc-400 text-center p-2'>Yes</td>
                        <td className='border border-zinc-400 text-center p-2'>Yes</td>
                        <td className='border border-zinc-400 text-center p-2'>Yes</td>
                        <td className='border border-zinc-400 text-center p-2'>Yes</td>
                        <td className='border border-zinc-400 text-center p-2'>Yes</td>
                        <td className='border border-zinc-400 text-center p-2'>Yes</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <h1>This license lets others distribute, remix, adapt, and build upon your work, even commercially, as long as they credit you for the original creation. This is the most accommodating of licenses offered. Recommended for maximum dissemination and use of licensed materials.</h1>
        </div>

    </div>
  )
}

export default copyright