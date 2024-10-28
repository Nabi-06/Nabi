interface TextBoxProps {
  title: string;
  content: string;
  titleBgColor: string;
}

function TextBox({ title, content, titleBgColor }: TextBoxProps) {
  return (
    <div className="bg-white border text-center border-black rounded-md flex flex-col">
      <div className={` py-2 font-bold ${titleBgColor}`}>
        <span>{title}</span>
      </div>
      <hr className="bg-black h-0.5" />
      <div className="py-3 px-6 flex flex-col items-center justify-center grow">
        <p>{content}</p>
      </div>
    </div>
  );
}

export default TextBox;
