import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { parse } from "https://deno.land/std/encoding/csv.ts";

const app = new Application();
const router = new Router();

const dataPath = "Airplane_Crashes_and_Fatalities_Since_1908.csv";

interface AircraftIncident {
  Date: string;
  Time: string;
  Location: string;
  Operator: string;
  "Flight #": string;
  Route: string;
  Type: string;
  Registration: string;
  "cn/In": string;
  Aboard: number;
  Fatalities: number;
  Ground: number;
  Summary: string;
}

let records: AircraftIncident[] = [];

async function readData(): Promise<void> {
  const data = await Deno.readFile(dataPath);
  const decoder = new TextDecoder("utf-8");
  const decodedData = decoder.decode(data);
  records = await parse(decodedData, {
    header: true,
  }) as AircraftIncident[];
}

readData();

router.get("/", async (ctx) => {
  ctx.response.body = records;
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server is running on http://localhost:8000");

await app.listen({ port: 8000 });
