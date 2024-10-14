import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function DownloadTamperMonekyScript({
  domainName,
  chatbotURL,
  customerName,
}: {
  domainName: string;
  chatbotURL: string;
  customerName: string;
}) {
  const scriptContent = `
    // ==UserScript==
    // @name         QChatBot Integration - ${customerName}
    // @namespace    http://tampermonkey.net/
    // @version      2024-02-14
    // @description  Embed the Chatbot within any website!
    // @author       You
    // @match        https://${domainName}/*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
    // @grant        none
    // ==/UserScript==

    (function() {
        'use strict';
        
        // Create iframe to embed the chatbot
        var iframe = document.createElement('iframe');
        iframe.setAttribute('id', 'chatbot-iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.src = '##URL##';
        document.body.appendChild(iframe);
    })();`;

  const downloadScript = async () => {
    const urlWithToken = (await getRedirectUrl(chatbotURL)) || "";

    if (urlWithToken == "") return null;

    // Replace ##URL## with the actual URL including the token
    const scriptContentWithToken = scriptContent.replace(
      "##URL##",
      urlWithToken
    );
    const blob = new Blob([scriptContentWithToken], {
      type: "text/javascript",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qchat-script-${customerName}.user.js`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button onClick={downloadScript}>
            <ArrowDownTrayIcon className="h-4 inline-flex" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>😇 Download Tampermonkey Script to embed Chatbot in website!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

async function getRedirectUrl(url) {
  try {
    const response = await fetch(url + "&redirectUrl=true", {
      method: "GET",
    });

    const data = await response.json();

    return formatURL(data.redirectUrl);
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

function formatURL(url) {
  // Remove 'serve.js' since we're embedding directly via iframe
  const parsedUrl = new URL(url);
  return `${parsedUrl.origin}${parsedUrl.pathname}${parsedUrl.search}`;
}
