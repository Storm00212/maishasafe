const {db} = require("../config/firebase.js"); // Firestore instance
const {v4: uuidv4} = require("uuid"); // for unique chat IDs

const responses = {
  en: {
    tips: [
      "Always share your live location with a trusted contact.",
      "Avoid walking alone late at night in unsafe areas.",
      "Keep emergency numbers saved in your phone.",
      "Trust your instincts—if a situation feels unsafe, leave immediately.",
    ],
    p3: ["To obtain a P3 form in Kenya:",
      "1. Report the incident to the nearest police station.",
      "2. Get the P3 form issued by police.",
      "3. Visit a government hospital for examination and medical report.",
      "4. Return the completed form to the police for legal action."],
    police: ["According to the Kenyan Constitution",
      "you have the right to remain silent",
      "to be informed of the reason for your arrest",
      "to communicate with your lawyer or family",
      "and not to be detained without being charged within 24 hours."],
    counseling: ["You are not alone.",
      "Consider reaching out to counseling centers such as LVCT Health",
      "Alternatively call the Kenya Gender Violence Centre hotline: 1195."],
    gbv: ["If you are a survivor of GBV:",
      "1) Get to a safe location.",
      "2) Call the toll-free helpline 1195.",
      "3) Seek immediate medical attention at a government hospital.",
      "4) Report to the nearest police station and request a P3 form."],
    harassment: ["If you are being harassed:",
      "1) Leave the unsafe environment if possible.",
      "2) Document the incident.",
      "3) Report to a trusted person or the nearest police station.",
      "4) Call 1195 for support services."],
    medical: ["In case of a medical emergency:",
      "1) Call 999 or 112 immediately.",
      "2) If possible, ask a trusted person for help.",
      "3) Go to the nearest hospital."],
  },
  sw: {
    tips: [
      "Daima shiriki eneo lako la moja kwa moja na mtu unayemwamini.",
      "Epuka kutembea peke yako usiku katika maeneo hatarishi.",
      "Hifadhi nambari za dharura kwenye simu yako.",
      "Sikiliza hisia zako—kama hali si salama, ondoka mara moja.",
    ],
    p3: ["Kupata fomu ya P3 nchini Kenya:",
      "1) Ripoti tukio katika kituo cha polisi kilicho karibu.",
      "2) Polisi watakupa fomu ya P3.",
      "3) Nenda hospitali ya serikali kwa uchunguzi na ripoti ya matibabu.",
      "4) Rudisha fomu iliyokamilika kwa polisi kwa hatua za kisheria."],
    police: ["Kulingana na Katiba ya Kenya,",
      "una haki ya kunyamaza,",
      "kuelezwa sababu ya kukamatwa,",
      "kuwasiliana na wakili au familia yako,",
      "na kutodumu kizuizini zaidi ya masaa 24 bila kufunguliwa mashtaka."],
    counseling: ["Hujako peke yako.",
      "Wasiliana na vituo vya ushauri kama vile LVCT Health",
      "au piga simu kwa kituo cha Gender Violence Recovery Centre: 1195."],
    gbv: ["Ikiwa wewe ni mwathirika wa GBV:",
      "1) Tafuta sehemu salama.",
      "2) Piga simu ya bure 1195.",
      "3) Tafuta matibabu ya haraka katika hospitali ya serikali.",
      "4) Ripoti katika kituo cha polisi na uombe fomu ya P3."],
    harassment: ["Ikiwa unanyanyaswa:",
      "1) Ondoka mahali ambapo si salama ikiwa inawezekana.",
      "2) Hifadhi ushahidi wa tukio.",
      "3) Ripoti kwa mtu unayemwamini au kituo cha polisi kilicho karibu.",
      "4) Piga simu 1195 kwa msaada."],
    medical: ["Katika dharura ya matibabu:",
      "1) Piga simu 999 au 112 mara moja.",
      "2) Ikiwa inawezekana, muombe mtu unayemwamini msaada.",
      "3) Nenda hospitali iliyo karibu."],
  },
};// Hizi ni prebuilt chat responses for educating the user and stuff. Kwa front end unaeza eka such that user ataselect one of the questions then atapata these responses.
// chatbot.
const chatbotController = async (req, res) => {
  try {
    const {query, language = "en", userId = "anonymous"} = req.body;
    const lang = language.toLowerCase() === "sw" ? "sw" : "en";
    const lowerQuery = query.toLowerCase();

    let reply;

    if (lowerQuery.includes("tip") || lowerQuery.includes("ushauri")) {
      const tips = responses[lang].tips;
      reply = tips[Math.floor(Math.random() * tips.length)];
    } else if (lowerQuery.includes("p3")) {
      reply = responses[lang].p3.join(" ");
    } else if (lowerQuery.includes("police") || lowerQuery.includes("polisi")) {
      reply = responses[lang].police.join(" ");
    } else if (
      lowerQuery.includes("counsel") ||
      lowerQuery.includes("ushauri") ||
      lowerQuery.includes("msaada")
    ) {
      reply = responses[lang].counseling.join(" ");
    } else if (lowerQuery.includes("gbv")) {
      reply = responses[lang].gbv.join(" ");
    } else if (
      lowerQuery.includes("harass") ||
      lowerQuery.includes("unyanyas")
    ) {
      reply = responses[lang].harassment.join(" ");
    } else if (
      lowerQuery.includes("medical") ||
      lowerQuery.includes("emergency") ||
      lowerQuery.includes("matibabu") ||
      lowerQuery.includes("dharura")
    ) {
      reply = responses[lang].medical.join(" ");
    } else {
      reply =
        lang === "sw" ?
          "Samahani, sijaelewa. Tafadhali jaribu kuuliza tena." :
          "Sorry, I didn’t understand that. Please try again.";
    }

    // Save chat log to database.
    const chatId = uuidv4();
    const chatLog = {
      chatId,
      userId,
      query,
      response: reply,
      language: lang,
      createdAt: new Date(),
    };

    await db.collection("chatbotLogs").doc(chatId).set(chatLog);
    console.log("Writing to firestore", chatLog);
    return res.status(200).json({
      success: true,
      response: reply,
      logId: chatId,
    });
  } catch (err) {
    console.error("❌ Chatbot error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Fetch chat history for a user.(hii ni ya in case user anadai kurefer to previous chats to understand something, so unaeza zimap kwa conversation in frontend.)
const getChatHistory = async (req, res) => {
  try {
    const {userId} = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "Missing userId parameter",
      });
    }

    const snapshot = await db
        .collection("chatbotLogs")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .limit(20)
        .get();

    const history = snapshot.docs.map((doc) => doc.data());

    return res.status(200).json({
      success: true,
      userId,
      history,
    });
  } catch (err) {
    console.error("❌ GetChatHistory error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

module.exports = {chatbotController, getChatHistory};
