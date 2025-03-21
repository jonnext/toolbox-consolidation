import React from "react";

const SummaryComponent = () => {
  return (
    <div className="h-[378px] flex-col justify-start items-center gap-6 inline-flex">
      <div className="self-stretch text-[#101828] text-3xl font-semibold font-['Inter'] leading-[38px]">
        ⚡️ 30 second Summary
      </div>
      <div className="self-stretch text-[#101828] text-lg font-normal font-['Inter'] leading-7">
        Let's create your very own banking chatbot, the BankerBot! This project
        is going to supercharge your skills in Amazon Lex and AWS Lambda, giving
        you the power to build something interactive and practical.
        <br />
        Amazon Lex is a tool that helps you create programs that can talk or
        chat with people, just like Siri or Alexa. It understands what people
        say or type and helps the program respond in a useful way.
        <br />
        This means an Amazon Lex chatbot doesn’t just respond, but also uses
        AI/ML to understand the user's goals and processes requests about their
        bank balances and transactions. You can even converse with your
        BankerBot using voice commands!
      </div>
    </div>
  );
};

export default SummaryComponent;
