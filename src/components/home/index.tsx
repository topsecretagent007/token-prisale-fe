"use client"

import { FC, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserContext from "@/context/UserContext";
import { coinInfo } from "@/utils/types";
import { getCoinsInfo, getSolPriceInUSD } from "@/utils/util";
import { CoinBlog } from "../cards/CoinBlog";
import TopToken from "./TopToken";
import FilterList from "./FilterList";
import Spinner from "../loadings/Spinner";
import { useSocket } from "@/contexts/SocketContext";
import FollowUs from "./FollowUs";
import { GrNext, GrPrevious } from "react-icons/gr";

const HomePage: FC = () => {
  const { isLoading, setIsLoading, setSolPrice } = useContext(UserContext);
  const { newToken, newPresaleBuyTx, presaleCompleteSocket, distributeSocket, distributeStartSocket, distributeCompleteSocket, refundSocket, refundStartSocket, refundCompleteSocket } = useSocket();
  const [data, setData] = useState<coinInfo[]>([]);
  const [firstData, setFirstData] = useState<coinInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // current page state
  const [itemsPerPage] = useState(12); // number of items per page (12 cards per page)
  const router = useRouter();

  const handleToRouter = (id: string) => {
    setIsLoading(true);
    router.push(id);
  };

  const getData = async () => {
    try {
      setIsLoading(true);
      const coins = await getCoinsInfo();
      const price = await getSolPriceInUSD();
      if (coins) {
        coins.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setData(coins);
        setFirstData(coins);
        setSolPrice(price);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (newToken) {
      setData((prev) => [newToken as unknown as coinInfo, ...prev]);
    }
  }, [newToken]);


  useEffect(() => {
    if (newPresaleBuyTx && newPresaleBuyTx?.token) {
      const updatedData = data.map((item) => {
        if (item.token === newPresaleBuyTx.token) {
          // Update only the matching token with the new data from `newPresaleBuyTx`
          return { ...item, ...newPresaleBuyTx };
        }
        return item;
      });
      setData(updatedData); // Update the state with the modified data
    }

    if (presaleCompleteSocket && presaleCompleteSocket?.token) {
      const updatedData = data.map((item) => {
        if (item.token === presaleCompleteSocket.token) {
          // Update only the matching token with the new data from `presaleCompleteSocket`
          return { ...item, ...presaleCompleteSocket };
        }
        return item;
      });
      setData(updatedData); // Update the state with the modified data
    }

    if (distributeSocket && distributeSocket?.token) {
      const updatedData = data.map((item) => {
        if (item.token === distributeSocket.token) {
          // Update only the matching token with the new data from `distributeSocket`
          return { ...item, ...distributeSocket };
        }
        return item;
      });
      setData(updatedData); // Update the state with the modified data
    }

    if (distributeStartSocket && distributeStartSocket?.token) {
      const updatedData = data.map((item) => {
        if (item.token === distributeStartSocket.token) {
          // Update only the matching token with the new data from `distributeStartSocket`
          return { ...item, ...distributeStartSocket };
        }
        return item;
      });
      setData(updatedData); // Update the state with the modified data
    }

    if (distributeCompleteSocket && distributeCompleteSocket?.token) {
      const updatedData = data.map((item) => {
        if (item.token === distributeCompleteSocket.token) {
          // Update only the matching token with the new data from `distributeCompleteSocket`
          return { ...item, ...distributeCompleteSocket };
        }
        return item;
      });
      setData(updatedData); // Update the state with the modified data
    }

    if (refundSocket && refundSocket?.token) {
      const updatedData = data.map((item) => {
        if (item.token === refundSocket.token) {
          // Update only the matching token with the new data from `refundSocket`
          return { ...item, ...refundSocket };
        }
        return item;
      });
      setData(updatedData); // Update the state with the modified data
    }

    if (refundStartSocket && refundStartSocket?.token) {
      const updatedData = data.map((item) => {
        if (item.token === refundStartSocket.token) {
          // Update only the matching token with the new data from `refundStartSocket`
          return { ...item, ...refundStartSocket };
        }
        return item;
      });
      setData(updatedData); // Update the state with the modified data
    }

    if (refundCompleteSocket && refundCompleteSocket?.token) {
      const updatedData = data.map((item) => {
        if (item.token === refundCompleteSocket.token) {
          // Update only the matching token with the new data from `refundCompleteSocket`
          return { ...item, ...refundCompleteSocket };
        }
        return item;
      });
      setData(updatedData); // Update the state with the modified data
    }
  }, [newPresaleBuyTx, presaleCompleteSocket, distributeSocket, distributeStartSocket, distributeCompleteSocket, refundSocket, refundStartSocket, refundCompleteSocket]);

  // Calculate the current items to be shown
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Total pages calculation
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Generate the page numbers to display, showing surrounding pages
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const delta = 2; // Number of pages to show before and after the current page
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, currentPage + delta);

    if (start > 1) pageNumbers.push(1); // Add first page
    if (start > 2) pageNumbers.push('...'); // Add ellipsis before
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    if (end < totalPages - 1) pageNumbers.push('...'); // Add ellipsis after
    if (end < totalPages) pageNumbers.push(totalPages); // Add last page

    return pageNumbers;
  };

  return (
    <div className="relative flex flex-col gap-4 w-full h-full">
      <div className="bg-[radial-gradient(100%_478.83%_at_0%_0%,_#FFF8E8_20%,_#FCD582_80%)] px-5 py-14 w-full h-full">
        <div className="z-20 mx-auto w-full max-w-[1240px] h-full">
          <TopToken data={data} />
        </div>
      </div>
      <div className="z-30 mx-auto px-5 w-full max-w-[1240px] h-full">
        <FilterList firstData={firstData} tokenData={data} setData={setData} />
      </div>
      <div className="z-20 flex flex-col gap-6 mx-auto px-5 pb-14 w-full max-w-[1360px] h-full">
        {data && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-8 w-full h-full">
            {currentItems.map((temp, index) => (
              <div
                key={index}

                onClick={() => {
                  if (temp.status === 0 || temp.status === 1 || temp.status === 2) {
                    handleToRouter(`/presaletrade/${temp.token}`);
                  } else if (temp.status === 3 || temp.status === 5) {
                    handleToRouter(`/trading/${temp.token}`);
                  }
                }}
                className="bg-[#FFFFFC] mx-auto rounded-[12px] w-full max-w-[410px] h-[205px] cursor-pointer shadow-md"
              >
                <CoinBlog coin={temp} componentKey="coin"></CoinBlog>
              </div>
            ))}
          </div>
        )}
        {currentItems.length === 0 && (
          <div className="flex flex-col justify-center items-center py-8 w-full h-full">
            <p className="text-lg text-[#2B35E1] font-semibold">Currently, you don't have any tokens.</p>
          </div>
        )}

        {currentItems.length > 0 &&
          <div className="flex flex-row justify-between items-center w-full h-full">
            <div className="flex flex-row items-center gap-2 text-[#0F172A] text-sm">
              Found
              <div className="flex flex-col bg-[#D6E4FE] px-2 py-1 rounded-full font-semibold text-[#2B35E1]">
                {data.length}
              </div>
              tokens/Projects.
            </div>
            <div className="flex flex-row items-center gap-2">
              {/* Pagination controls */}
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-3 rounded-lg text-[#2B35E1] cursor-pointer"
              >
                <GrPrevious />
              </button>

              {/* Page number buttons */}
              {generatePageNumbers().map((number, index) =>
                typeof number === "number" ? (
                  <button
                    key={index}
                    onClick={() => paginate(number)}
                    className={`px-[13px] py-[5.5px] rounded-lg ${number === currentPage ? "bg-[#2B35E1] text-white" : "text-[#2B35E1]"
                      }`}
                  >
                    {number}
                  </button>
                ) : (
                  <span key={index} className="px-[13px] py-[5.5px] text-[#2B35E1]">
                    {number}
                  </span>
                )
              )}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-3 rounded-lg text-[#2B35E1] cursor-pointer"
              >
                <GrNext />
              </button>
            </div>
          </div>
        }

      </div>

      <FollowUs />
      {isLoading && <Spinner />}
    </div >
  );
};

export default HomePage;
