"use client";
type ShareButtonProps = {
  className: string;
  children?: React.ReactNode;
};

export default function ShareButton(props: ShareButtonProps) {
  const handleClick = () => {
    if (navigator.share) {
      navigator.share({
        url: location.href,
      });
    } else {
      navigator.clipboard.writeText(location.href);
      alert("Link copied to your clipboard!");
    }
  };

  return (
    <button className={props.className} onClick={handleClick}>
      {props.children}
    </button>
  );
}
