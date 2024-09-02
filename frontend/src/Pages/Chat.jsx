import { Box } from "@chakra-ui/layout";
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ChatState } from '../context/chatProvider'
import ProfileModal from '../components/ProfileModal'
import SideDrawer from '../components/SideDrawer'
import MyChat from '../components/MyChat'
import ChatBox from '../components/ChatBox'

function Chat() {
  const [fetchAgain, setFetchAgain] = useState();
  const { user } = ChatState();
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChat fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  )
}

export default Chat
