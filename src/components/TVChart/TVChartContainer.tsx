"use client"
import { useContext, useEffect, useRef, useState } from "react";
import { ChartingLibraryWidgetOptions, HistoryCallback, IChartingLibraryWidget, IDatafeedChartApi, LanguageCode, ResolutionString, SearchSymbolResultItem, widget } from "@/libraries/charting_library";
import { usePathname } from "next/navigation";
import { Bar, PeriodParamsInfo, recordInfo } from "@/utils/types";
import { getCoinTrade } from "@/utils/util";
import { chartOverrides, disabledFeatures, enabledFeatures } from "@/utils/constants";
import { getDataFeed } from "./datafeed";
import ReactLoading from "react-loading";
import { twMerge } from "tailwind-merge";
import { flare } from "viem/chains";
import UserContext from "@/context/UserContext";
import { useSocket } from "@/contexts/SocketContext";


export type TVChartContainerProps = {
    name: string;
    pairIndex: number;
    token: string;
    customPeriodParams: PeriodParamsInfo;
    classNames?: {
        container: string;
    };
};

export const TVChartContainer = ({
    name,
    pairIndex,
    token,
    customPeriodParams
}: TVChartContainerProps) => {
    const chartContainerRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
    const tvWidgetRef = useRef<IChartingLibraryWidget | null>(null);
    const { isLoading, setIsLoading } = useContext(UserContext);
    const { newSwapTradingSocket } = useSocket()

    useEffect(() => {
        if (!chartContainerRef.current) return () => { };

        if (tvWidgetRef.current) {
            tvWidgetRef.current.remove();
        }

        const elem = chartContainerRef.current;
        if (name) {
            const widgetOptions: ChartingLibraryWidgetOptions = {
                symbol: name,
                debug: false,
                datafeed: getDataFeed({ pairIndex, name, token, customPeriodParams }),
                theme: "dark",
                locale: "en",
                container: elem,
                library_path: `${location.protocol}//${location.host}/libraries/charting_library/`,
                loading_screen: {
                    backgroundColor: "#FFFFFC",
                    foregroundColor: "#FFFFFC",
                },
                enabled_features: enabledFeatures,
                disabled_features: disabledFeatures,
                client_id: "tradingview.com",
                user_id: "public_user_id",
                fullscreen: false,
                autosize: true,
                custom_css_url: "/tradingview-chart.css",
                overrides: {
                    ...chartOverrides,
                    "priceScale.align": "right",  // Align price scale to the right
                    // More custom overrides as needed
                },
                interval: "1D" as ResolutionString,
            };

            tvWidgetRef.current = new widget(widgetOptions);
            tvWidgetRef.current.onChartReady(function () {
                setIsLoading(false);
            });

            return () => {
                if (tvWidgetRef.current) {
                    tvWidgetRef.current.remove();
                }
            };
        }
    }, [name, pairIndex, newSwapTradingSocket]);

    return (
        <div className="relative bg-[#131722] shadow-sm mb-[1px] p-3 rounded-[24px] w-full h-[421px]">
            {isLoading ? (
                <div className="top-0 left-0 z-9999 absolute flex justify-center items-center bg-tizz-background w-full h-full">
                    <ReactLoading height={20} width={50} type={"bars"} color={"#131722 F"} />
                </div>
            ) : null}
            <div ref={chartContainerRef} className={twMerge("rounded-[24px] w-full h-full")} />
        </div>
    );
};

