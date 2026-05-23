"use client";

const FALLBACK_TEXT =
  "🎓 ড্যাফোডিল ইনস্টিটিউট অব আইটি (DIIT) তে আপনাকে স্বাগতম — উন্নত শিক্ষা, আধুনিক প্রযুক্তি এবং উজ্জ্বল ভবিষ্যতের পথে আপনার যাত্রা শুরু হোক আমাদের সাথে।";

const MarqueeNotice = ({ text, enabled = true }) => {
  if (!enabled) return null;

  const noticeText = text || FALLBACK_TEXT;

  return (
    <div className="marquee-notice-bar">
      <div className="marquee-notice-track">
        {/* Duplicate content for seamless infinite loop */}
        <span className="marquee-notice-text">{noticeText}</span>
        <span className="marquee-notice-separator text-white">✦</span>
        <span className="marquee-notice-text">{noticeText}</span>
        <span className="marquee-notice-separator text-white">✦</span>
        <span className="marquee-notice-text">{noticeText}</span>
        <span className="marquee-notice-separator text-white">✦</span>
        <span className="marquee-notice-text">{noticeText}</span>
        <span className="marquee-notice-separator text-white">✦</span>
      </div>
    </div>
  );
};

export default MarqueeNotice;
