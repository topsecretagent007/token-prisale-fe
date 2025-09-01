import { FaTelegramPlane, FaTwitter, FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const PresaleTarget = process.env.NEXT_PUBLIC_PRESALE_TARGET!
export const Decimal = process.env.NEXT_PUBLIC_TEST_DECIMALS
export const SlippageAmount = process.env.NEXT_PUBLIC_SLIPPAGE
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const ProfileMenuList = [
    // { id: 1, text: "Coins hold", },
    { id: 4, text: "Coins created", },
    // { id: 5, text: "Followers", },
    // { id: 6, text: "Following", },
]

export const StagesData = [
    { id: "one", text: "One" },
    { id: "tow", text: "Tow" },
    { id: "three", text: "Three" },
    { id: "four", text: "Four" },
]

export const StageDurationData = [
    { id: 1, text: "1 Days" },
    { id: 1, text: "2 Days" },
    { id: 3, text: "3 Days" },
    { id: 4, text: "4 Days" },
    { id: 5, text: "5 Days" },
    { id: 6, text: "6 Days" },
    { id: 7, text: "7 Days" },
]

export const SellTaxDecayData = [
    { id: 1, text: "Unitill halfqy throgh - 10%" },
    { id: 2, text: "Unitill halfqy throgh - 20%" },
    { id: 3, text: "Unitill halfqy throgh - 30%" },
    { id: 4, text: "Unitill halfqy throgh - 40%" },
    { id: 5, text: "Unitill halfqy throgh - 50%" },
    { id: 6, text: "Unitill halfqy throgh - 60%" },
    { id: 7, text: "Unitill halfqy throgh - 70%" },
    { id: 8, text: "Unitill halfqy throgh - 80%" },
    { id: 9, text: "Unitill halfqy throgh - 90%" },
    { id: 10, text: "Unitill halfqy throgh - 100%" },
]

export const FinalTokenPoolData = [
    { id: "newlp", text: "NEWLP / SOL" },
    { id: "meteora", text: "Meteora / SOL" },
    { id: "raydium", text: "Raydium / SOL" },
    { id: "uniswap", text: "Uniswap / ETH" },
]

export const AdminSocialData = [
    { id: "twitter", name: "@lendon1114", icon: <FaXTwitter />, url: "https://x.com/lendon1114/" },
    { id: "telegram", name: "Topsecretagent_007", icon: <FaTelegramPlane />, url: "https://t.me/@topsecretagent_007/" },
]

export const FooterWildZoo = [
    { id: "fees", name: "Fees" },
    { id: "partnership", name: "Partnership Programs" },
    { id: "terms", name: "Terms of Service" },
    { id: "privacy", name: "Privacy Policies" },
    { id: "faq", name: "FAQ" },
]

export const FooterWowGo = [
    { id: "roadmap", name: "Roadmap" },
    { id: "tokenomics", name: "Tokenomics" },
    { id: "howtobuy", name: "How to buy" },
    { id: "lightpaper", name: "Lightpaper" },
]

export const FooterWildGo = [
    { id: "wowgotoken", name: "WOWGO Token" },
    { id: "wildgoclicker", name: "WILDGO Clicker" },
    { id: "wildgoplayfi", name: "WILDGO PlayFi" },
    { id: "wildzoo", name: "WILDZOO" },
]
