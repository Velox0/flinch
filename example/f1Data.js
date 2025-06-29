import { html, LiveElement, el } from "../dist/index.js";
import { createHead } from "./utils.js";
import fs from "fs";

let driverDetails = [];

/**
 * Initialize F1 driver data
 */
export const initializeF1Data = async () => {
  const f1DriversSavefile = "f1-drivers.json";

  if (fs.existsSync(f1DriversSavefile)) {
    const data = fs.readFileSync(f1DriversSavefile, "utf8");
    driverDetails = JSON.parse(data);
  } else {
    const drivers = await fetch(
      "https://api.openf1.org/v1/drivers?session_key=latest"
    );
    const driversData = await drivers.json();
    fs.writeFileSync(f1DriversSavefile, JSON.stringify(driversData));
    driverDetails = driversData;
  }
};

/**
 * Get driver details by driver number
 */
function getDriverDetails(driverNumber) {
  return driverDetails.find((driver) => driver.driver_number === driverNumber);
}

/**
 * Create F1 positions live element
 */
export const createF1PositionsElement = () => {
  return new LiveElement(
    "div",
    {
      class: "f1-positions",
      style:
        "display: flex; flex-direction: column; gap: 1rem; max-height: 50vh; overflow-y: auto; padding: 0.1rem 4rem;",
    },
    {
      initial: "<p style='color: #7df9aa'>Getting live positions</p>",
    },
    "https://api.openf1.org/v1/position?session_key=latest",
    2000,
    (data) => {
      function calcForegroundColor(teamColour) {
        teamColour = teamColour || "33AA66";
        const r = parseInt(teamColour.slice(0, 2), 16);
        const g = parseInt(teamColour.slice(2, 4), 16);
        const b = parseInt(teamColour.slice(4, 6), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128
          ? "#" +
              Math.floor(g / 2)
                .toString(16)
                .padStart(2, "0") +
              Math.floor(b / 6)
                .toString(16)
                .padStart(2, "0") +
              Math.floor(r / 2)
                .toString(16)
                .padStart(2, "0")
          : "#fff";
      }

      const currentPositions = data
        .slice(0, 20)
        .sort((a, b) => a.position - b.position);

      el.innerHTML = currentPositions
        .map((position) => {
          const driverDetails = getDriverDetails(position.driver_number);
          return `<p class="cool-card" style="margin: 0; display: flex; align-items: left; justify-content: space-between; gap: 1rem;"><span>[${position.position}]</span><span class="strong" style="background-color: #${driverDetails.team_colour || "3A6"}; border-radius: 3px; padding: 0.1rem .5rem; color:${calcForegroundColor(driverDetails.team_colour)}">${driverDetails.name_acronym}</span></p>`;
        })
        .join("");
    },
    "json"
  );
};

/**
 * Create F1 page component
 */
export const createF1Page = async () => {
  const f1Positions = createF1PositionsElement();

  return html`
    <!DOCTYPE html>
    <html lang="en">
      ${createHead("[not] F1 Live Positions")}
      <script>
        // Send local functions to the client using .toString()
        const driverDetails = ${JSON.stringify(driverDetails)};
        ${getDriverDetails.toString()};
      </script>
      <body>
        <p class="left-align">
          <a class="link-no-underline" href="/">← Back to Home</a>
        </p>

        <h1><span style="font-size: small;">[not]</span> F1 Live Positions</h1>
        <p>Live positions of the current F1 drivers.</p>
        <div style="display: flex; justify-content: center;">
          ${await f1Positions.render()}
        </div>
      </body>
    </html>
  `;
};
