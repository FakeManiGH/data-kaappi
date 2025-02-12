import React from 'react'
import {
    TwitterShareButton,
    TwitterIcon,
    FacebookShareButton,
    FacebookIcon,
    RedditShareButton,
    RedditIcon,
    WhatsappShareButton,
    WhatsappIcon,
    LinkedinShareButton,
    LinkedinIcon,
} from 'next-share';

const SocialShare = ({ file }) => {
  return (
    <div className='flex gap-2'>
        <TwitterShareButton
            url={file.shortUrl} >
            <TwitterIcon size={32} round />
        </TwitterShareButton>
        <FacebookShareButton
            url={file.shortUrl} >
            <FacebookIcon size={32} round />
        </FacebookShareButton>
        <RedditShareButton
            url={file.shortUrl} >
            <RedditIcon size={32} round />
        </RedditShareButton>
        <WhatsappShareButton
            url={file.shortUrl} >
            <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        <LinkedinShareButton
            url={file.shortUrl} >
            <LinkedinIcon size={32} round />
        </LinkedinShareButton>
    </div>
  )
}

export default SocialShare

