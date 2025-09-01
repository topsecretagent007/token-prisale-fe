import { createContext } from 'react';
import { coinInfo } from '@/utils/types';

const CoinContext = createContext({
    coin:{} as coinInfo,
    setCoin: (value: coinInfo) => {},
    
})

export default CoinContext;