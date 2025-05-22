import React from "react";
import "./App.css";
import {} from "@rive-app/react-canvas";
import ProjectInfoCard from "./Components/project-info";
import QuestionComponent from "./Components/QuestionComponent";
import ProgressBar from "./Components/ProgressBar";
import BottomBar from "./Components/BottomBar";
import ImageUpload from "./Components/ImageUpload";
import TextSelectionToolbarProvider from "./Components/TextSelectionToolbarProvider";
import { OverlayManagerProvider } from "./OverlayManager";
import { MultiParagraphNotesProvider } from "./MultiParagraphNotesContext";
import { ParagraphWithNotes } from "./ParagraphWithNotes";
import { BottomBarProvider } from "./Components/BottomBarContext";
import ParagraphWithAskBar from "./Components/ParagraphWithAskBar";

const paragraphs = [
  `Let's create your very own banking chatbot, the BankerBot! This project is going to supercharge your skills in Amazon Lex and AWS Lambda, giving you the power to build something interactive and practical.\n\nAmazon Lex is a tool that helps you create programs that can talk or chat with people, just like Siri or Alexa. It understands what people say or type and helps the program respond in a useful way.\n\nThis means an Amazon Lex chatbot doesn't just respond, but also uses AI/ML to understand the user's goals and processes requests about their bank balances and transactions. You can even converse with your BankerBot using voice commands!`,
  `AWS Lex helps you build chatbots that improve customer interactions. It uses Natural Language Processing to understand what users say, while Intent Recognition identifies their needs. Slot Filling keeps conversations flowing smoothly, and Voice Interaction lets users chat using their voice with AWS Polly. Plus, Analytics tracks interactions to boost performance, and smart Deployment strategies ensure your bot can scale effectively. Together, these features create engaging and efficient conversational agents.`,
  `When you're using Amazon Lex to build a chatbot, this threshold is like a minimum score for your chatbot to confidently understand what the user is trying to say. Setting this to 0.4 means that your chatbot needs to be at least 40% confident that it understands what the user is asking to be able to give a response. So if a user's input is ambiguous and your chatbot's confidence score is below 0.4, it'll throw an error message. You'll see how this works in a bit!`,
  `How much support and guidance do you want? There are two ✌️ equally awesome ways to can complete your project.`,
  `• Edit the first page - [Your Full Name] with your name!\n• Check out the final slide, which is a template for tracking errors - keep in mind that documenting errors is a fantastic way to show your problem solving skills! Keep this slide in mind if you ever run into an error, and make sure to add in some screenshots and explanations as you go.`,
];

function App() {
  return (
    <BottomBarProvider>
      <MultiParagraphNotesProvider>
        <OverlayManagerProvider>
          <TextSelectionToolbarProvider>
            <div className="app">
              {/* PROTOTYPE: ParagraphWithAskBar for testing */}
              <div className="w-full flex flex-col items-center py-8">
                <ParagraphWithAskBar />
              </div>
              <div className="w-full max-w-[720px] mx-auto h-screen flex flex-wrap pt-16 gap-16">
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
                    <h1 className="text-left self-stretch text-[#101828] text-5xl font-medium font-suisse leading-[60px]">
                      Build a chatbot with AWS LEX
                    </h1>
                    <div className="text-leftself-stretch text-[#344054] text-xl font-normal font-['Inter'] leading-[30px]">
                      Let's create your very own banking chatbot, the BankerBot!{" "}
                    </div>
                  </div>
                </div>
                <ProjectInfoCard />
                {paragraphs.map((text, idx) => (
                  <ParagraphWithNotes key={idx} id={idx} text={text} />
                ))}
                <div className="py-24 border-t border-b border-[#EAECF0] flex flex-col gap-20 w-full">
                  <ImageUpload />
                  <div className="flex flex-col">
                    <QuestionComponent />
                  </div>
                </div>
              </div>
            </div>
          </TextSelectionToolbarProvider>
        </OverlayManagerProvider>
      </MultiParagraphNotesProvider>
      <BottomBar />
    </BottomBarProvider>
  );
}

export default App;
