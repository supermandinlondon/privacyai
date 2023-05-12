'use client';

import { collection, orderBy, query } from "firebase/firestore";
import { useSession, signOut } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "all/firebase";
import ChatRow from "./ChatRow";
import NewChat from "./NewChat";
import NewRiskChat from "./NewRiskChat"; // Import NewRiskChat
import ModelSelection from "./ModelSelection";

function SideBar() {
  const { data: session } = useSession();
  const [chats, loading, error] = useCollection(
    session &&
      query(
        collection(db, "users", session.user?.email!, "chats"),
        orderBy("createdAt", "asc")
      )
  );

  // Check if the current route is related to risk assessment
  const isRiskAssessmentRoute =
    (typeof window !== "undefined" && window.location.pathname === "/riskassessment") ||
    window.location.pathname.startsWith("/protected/client/riskassessmentchat/");

  return (
    <div className="p-2 flex flex-col h-screen">
      <div className="flex-1">
        <div>
          {/* Conditionally render NewRiskChat or NewChat */}
          {isRiskAssessmentRoute ? <NewRiskChat /> : <NewChat />}

          <div className="hidden sm:inline">
            <ModelSelection />
          </div>

          <div className="flex flex-col space-y-2 my-2 text-white">
            {loading && (
              <div className="animate-pulse text-center text-white">
                <p>Loading Chats...</p>
              </div>
            )}

            {/* Map through the chatRows */}
            {chats?.docs
              .filter((chat) => {
                // If on a risk assessment route, only show risk assessment chats
                if (isRiskAssessmentRoute) {
                  return chat.data().isRiskAssessment === true;
                }
                // If on a non-risk assessment route, show all chats
                return true;
              })
              .map((chat) => (
                <ChatRow key={chat.id} id={chat.id} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;