import debug from "debug";
import HttpsProxyAgent from "https-proxy-agent";
import fetch, { RequestInit } from "node-fetch";
import { IData } from "./interface";

const logger = debug("hackattic:global-presence");

const BASE_API_URL = "https://hackattic.com/_/presence/";

/**
 * This took me entire day it was very difficult to find the proxy servers
 * I have used https://spys.one/ to search proxy
 * In the end scraped the proxy table from the spyone of around 150 proxies and trying them all to send the request, in the hope that some will work
 *
 * When this solution got passed (Fri Nov 11 1:00AM) 13 proxies had worked
 * Number of proxies that will workout is different for every run that's why you need to keep trying
 *
 * If you are looking this in a future date and lot of time have passed, I will suggest you to update the proxy list
 * This is the scraper function which I used to scrape the proxies
 * 
 * const getAllProxyList = () => {
    const proxies = [...document.querySelectorAll(".spy1xx > td:first-of-type > font")].map(fontNode => {
        const [host,,,port] = [...fontNode.childNodes];
        return `http://${host.data}:${port.data}`;
    });

    return proxies;
}
*
* All the best solving this 🌸
*/
const proxyList = [
  "http://133.242.171.216:3128",
  "http://190.107.234.139:999",
  "http://95.217.120.82",
  "http://195.154.106.167:80",
  "http://178.32.101.200:80",
  "http://102.68.78.13:3128",
  "http://172.105.226.115:443",
  "http://37.236.59.107:8080",
  "http://139.180.192.34:9000",
  "http://162.240.75.37:80",
  "http://41.128.148.83:1981",
  "http://15.207.51.7:80",
  "http://80.249.112.162:80",
  "http://190.107.233.227:999",
  "http://94.19.93.162:8080",
  "http://115.243.88.51:80",
  "http://54.36.26.122:80",
  "http://103.43.75.98:80",
  "http://110.77.184.132:8080",
  "http://178.62.92.133:80",
  "http://201.77.110.129:999",
  "http://41.220.125.198:8080",
  "http://80.252.5.34:7001",
  "http://186.1.206.154:3128",
  "http://112.133.223.220:80",
  "http://41.242.116.150:50000",
  "http://78.30.230.117:50932",
  "http://154.236.177.120:1976",
  "http://72.221.164.34:60671",
  "http://182.53.109.23:8080",
  "http://91.121.177.31:5284",
  "http://153.126.179.216:8080",
  "http://186.67.192.246:8080",
  "http://118.107.44.181:8000",
  "http://8.242.190.115:999",
  "http://138.117.85.97:999",
  "http://83.212.123.113:3888",
  "http://72.210.252.137:4145",
  "http://43.241.135.150:8080",
  "http://5.158.126.16:3128",
  "http://170.83.242.250:999",
  "http://139.99.131.74:8080",
  "http://31.206.250.131:9090",
  "http://185.231.114.140:8585",
  "http://181.224.253.29:8080",
  "http://159.69.130.36:8080",
  "http://95.217.120.82:3368",
  "http://173.212.250.65:57947",
  "http://14.56.234.92:8001",
  "http://185.108.141.49:8080",
  "http://102.66.163.162:9999",
  "http://38.94.109.12:80",
  "http://70.186.128.126:8080",
  "http://75.119.150.125:4977",
  "http://167.99.210.216:80",
  "http://82.200.237.10:8080",
  "http://138.197.66.68:40568",
  "http://12.218.209.130:53281",
  "http://118.26.110.48:8080",
  "http://94.198.40.18:80",
  "http://82.66.172.182:80",
  "http://78.47.68.183:80",
  "http://47.180.214.9:3128",
  "http://221.132.18.26:8090",
  "http://216.155.89.66:999",
  "http://213.230.108.161:8080",
  "http://176.236.85.246:9090",
  "http://54.36.239.180:5000",
  "http://46.101.49.62:80",
  "http://110.164.208.125:8888",
  "http://91.134.136.29:9000",
  "http://176.31.213.100:8080",
  "http://89.38.98.236:80",
  "http://183.89.65.54:8080",
  "http://5.172.177.24:3128",
  "http://91.92.209.67:8085",
  "http://72.221.171.130:4145",
  "http://118.107.44.181:80",
  "http://72.221.232.155:4145",
  "http://141.136.35.187:80",
  "http://192.252.216.81:4145",
  "http://38.94.109.7:80",
  "http://184.178.172.23:4145",
  "http://139.59.159.49:25818",
  "http://41.65.181.131:8089",
  "http://104.37.135.145:4145",
  "http://120.28.195.40:8282",
  "http://50.199.32.226:8080",
  "http://217.199.151.27:8080",
  "http://5.161.121.151:3128",
  "http://74.208.51.197:5000",
  "http://144.91.66.128:3128",
  "http://104.45.128.122:80",
  "http://85.10.199.48:80",
  "http://167.99.236.14:80",
  "http://104.131.121.7:80",
  "http://93.99.25.217:8080",
  "http://209.146.105.241:80",
  "http://74.91.116.171:3128",
  "http://94.230.183.226:8080",
  "http://200.71.115.3:8081",
  "http://159.192.139.178:8080",
  "http://104.248.90.212:80",
  "http://170.244.88.1:999",
  "http://103.125.162.134:83",
  "http://194.145.138.183:9090",
  "http://68.71.249.153:48606",
  "http://190.142.231.84:999",
  "http://109.194.22.61:8080",
  "http://62.171.188.233:8000",
  "http://98.188.47.132:4145",
  "http://113.53.60.249:8080",
  "http://74.119.144.60:4145",
  "http://167.71.97.252:80",
  "http://158.140.144.88:8111",
  "http://77.236.236.38:10000",
  "http://98.178.72.21:10919",
  "http://45.184.103.67:999",
  "http://42.3.27.74:80",
  "http://51.38.191.151:80",
  "http://196.202.215.143:41890",
  "http://185.198.72.60:3128",
  "http://37.235.20.148:8080",
  "http://200.25.254.193:54240",
  "http://14.170.154.10:8080",
  "http://181.224.207.141:999",
  "http://14.162.78.67:80",
  "http://135.181.103.249:8888",
  "http://1.179.148.9:55636",
  "http://87.248.156.104:8080",
  "http://72.170.220.17:8080",
  "http://24.116.218.195:8080",
  "http://196.223.63.234:8080",
  "http://51.103.137.65:80",
  "http://213.14.179.33:3127",
  "http://192.210.196.11:1119",
  "http://121.139.218.165:31409",
  "http://143.198.187.65:38172",
  "http://72.210.221.197:4145",
  "http://68.71.254.6:4145",
  "http://191.97.16.126:999",
  "http://5.202.66.167:8080",
  "http://195.248.240.82:3128",
  "http://183.89.40.80:8080",
  "http://80.244.229.157:8080",
  "http://185.93.206.59:8080",
  "http://188.132.222.49:8080",
  "http://24.249.199.12:4145",
  "http://98.175.31.195:4145",
  "http://142.93.10.111:14096",
  "http://43.204.16.38:80",
  "http://185.49.96.94:8080",
  "http://157.245.130.145:7497"
];

export const solver = async (
  problemUrl: string,
  submissionUrl: string
): Promise<void> => {
  const data: IData | null = await fetchInput(problemUrl);
  if (data === null) return;
  logger("%O", data);
  const locationsVisited = await requestUsingProxy(data.presence_token);
  logger(`Proxied worked ${locationsVisited}`);
  const result = await sendOutput(submissionUrl, {});
  logger(`Result = ${result}`);
};

const sendRequest = (
  apiUrl: string,
  proxyServer: string,
  useProxy: boolean
) => {
  return new Promise((resolve, reject) => {
    const options: RequestInit = {
      method: "GET"
    };
    if (useProxy) {
      // @ts-expect-error HttpsProxyAgent lacks the constructor signature
      const proxyAgent = new HttpsProxyAgent(proxyServer);
      options.agent = proxyAgent;
    }

    fetch(apiUrl, options)
      .then((response) => {
        const status = response.status;
        if (status === 200) return response.text();
        reject(new Error("Proxy not working"));
      })
      .then((country: string) => {
        logger(`Proxy server = ${proxyServer} is from country ${country}`);
        resolve(proxyServer);
      })
      .catch((error) => reject(error));

    // timeout request after 15 seconds
    setTimeout(() => {
      if (useProxy) {
        logger(`Timed out request for proxy ${proxyServer}`);
      }
      return reject(new Error("Request timedout"));
    }, 25000);
  });
};

const requestUsingProxy = async (token: string) => {
  const apiUrl = `${BASE_API_URL}${token}`;
  const requestPromiseList = proxyList.map((proxy) => {
    return sendRequest(apiUrl, proxy, true);
  });

  requestPromiseList.push(sendRequest(apiUrl, "", false));

  const results = await Promise.allSettled(requestPromiseList);
  return results.filter((result) => result.status === "fulfilled").length;
};

const fetchInput = async (problemUrl: string): Promise<IData | null> => {
  try {
    const response = await fetch(problemUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    logger(error);
  }
  return null;
};

const sendOutput = async (
  submissionUrl: string,
  message: unknown
): Promise<string> => {
  const response = await fetch(submissionUrl, {
    method: "POST",
    headers: {
      Accept: "application.json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  });

  const res = await response.text();
  return res;
};
