import { useState } from "react";
import "./App.css";
import {} from "@rive-app/react-canvas";
import ProjectInfoCard from "./Components/project-info";
import QuestionComponent from "./Components/QuestionComponent";
import ProgressBar from "./Components/ProgressBar";
import BottomBar from "./Components/BottomBar";
import ImageUpload from "./Components/ImageUpload";
import screenshot from "./assets/images/screenshot-1.png";
import AnimationComponent from "./Components/AnimationComponent";
import ParagraphToImageConversion from "./Components/ParagraphToImageConversion";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <ProgressBar />
      <div className="w-[688px] h-screen flex flex-wrap pt-16 gap-16">
        <div className="h-[142px] flex-col justify-start items-start gap-4 inline-flex">
          <div className="justify-start items-center gap-4 inline-flex">
            <div className="px-2.5 py-1 bg-white rounded-lg shadow border border-[#d0d5dd] justify-start items-center gap-1.5 flex">
              <div className="w-2 h-2 relative">
                <div className="w-1.5 h-1.5 left-[1px] top-[1px] absolute bg-[#2970ff] rounded-full" />
              </div>
              <div className="text-center text-[#344054] text-sm font-medium font-['Inter'] leading-tight">
                PROJECT
              </div>
            </div>
          </div>
          <div className="self-stretch h-[98px] flex-col justify-start items-start gap-2 flex">
            <div className="text-left self-stretch text-[#101828] text-5xl font-medium font-['Inter'] leading-[60px]">
              Build a chatbot with AWS LEX
            </div>
            <div className="text-leftself-stretch text-[#344054] text-xl font-normal font-['Inter'] leading-[30px]">
              Let's create your very own banking chatbot, the BankerBot!{" "}
            </div>
          </div>
        </div>
        <ProjectInfoCard />

        <div className="h-[378px] flex-col justify-start items-center gap-6 inline-flex">
          <div className="text-left self-stretch text-[#101828] text-3xl font-semibold font-['Inter'] leading-[38px]">
            ⚡️ 30 second Summary
          </div>
          <div className="text-left self-stretch text-[#101828] text-lg font-normal font-['Inter'] leading-7">
            Let's create your very own banking chatbot, the BankerBot! This
            project is going to supercharge your skills in Amazon Lex and AWS
            Lambda, giving you the power to build something interactive and
            practical.
            <br />
            Amazon Lex is a tool that helps you create programs that can talk or
            chat with people, just like Siri or Alexa. It understands what
            people say or type and helps the program respond in a useful way.
            <br />
            This means an Amazon Lex chatbot doesn't just respond, but also uses
            AI/ML to understand the user's goals and processes requests about
            their bank balances and transactions. You can even converse with
            your BankerBot using voice commands!
          </div>
        </div>
        <div className="flex-col justify-start items-center gap-6 inline-flex w-full">
          <div className="text-left self-stretch text-[#101828] text-3xl font-semibold font-['Inter'] leading-[38px]">
            Welcome to your AWS project on Amazon Lex!{" "}
          </div>

          <div className="w-full text-left mb-12">
            <h3 className="text-[#101828] text-2xl font-semibold font-['Inter'] leading-8 mb-4">
              AWS Lex capabilities
            </h3>
            <ParagraphToImageConversion className="text-[#344054] text-lg font-normal font-['Inter'] leading-7">
              AWS Lex helps you build chatbots that improve customer
              interactions. It uses Natural Language Processing to understand
              what users say, while Intent Recognition identifies their needs.
              Slot Filling keeps conversations flowing smoothly, and Voice
              Interaction lets users chat using their voice with AWS Polly.
              Plus, Analytics tracks interactions to boost performance, and
              smart Deployment strategies ensure your bot can scale effectively.
              Together, these features create engaging and efficient
              conversational agents.
            </ParagraphToImageConversion>

            <div className="mt-6 border-l-4 border-[#000000] pl-4 py-2">
              <h4 className="text-[#101828] text-lg font-medium font-['Inter'] leading-7 mb-2">
                💡 What does intent classification confidence score threshold
                mean?
              </h4>
              <ParagraphToImageConversion className="text-[#344054] text-lg font-normal font-['Inter'] leading-7">
                When you're using Amazon Lex to build a chatbot, this threshold
                is like a minimum score for your chatbot to confidently
                understand what the user is trying to say. Setting this to 0.4
                means that your chatbot needs to be at least 40% confident that
                it understands what the user is asking to be able to give a
                response. So if a user's input is ambiguous and your chatbot's
                confidence score is below 0.4, it'll throw an error message.
                You'll see how this works in a bit!
              </ParagraphToImageConversion>
            </div>
          </div>

          <div className="text-left self-stretch text-[#101828] text-lg font-normal font-['Inter'] leading-7 mt-4">
            How much support and guidance do you want? There are two ✌️ equally
            awesome ways to can complete your project.
          </div>
        </div>
        <div className="py-24 border-t border-b border-[#EAECF0] flex flex-col gap-20 w-full">
          <ImageUpload />
          <div className="flex flex-col">
            <QuestionComponent />
          </div>
        </div>
        <div className="text-[#344054] text-lg font-normal font-['Inter'] leading-7 text-left">
          • Edit the first page - [Your Full Name] with your name!
          <br />• Check out the final slide, which is a template for tracking
          errors - keep in mind that documenting errors is a fantastic way to
          show your problem solving skills! Keep this slide in mind if you ever
          run into an error, and make sure to add in some screenshots and
          explanations as you go.
        </div>
      </div>
      <BottomBar />
    </div>
  );
}

export default App;
