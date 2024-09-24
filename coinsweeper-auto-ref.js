const axios = require('axios');
const readline = require('readline');
require('colors');

const url = "https://pentil.pink/bybitcoinsweeper/index.php";
const referralCodeInputName = "referral_code";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function submitReferral(referralCode) {
    const payload = new URLSearchParams();
    payload.append(referralCodeInputName, referralCode);

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://pentil.pink/bybitcoinsweeper/'
    };

    try {
        const response = await axios.post(url, payload, { headers });
        const output = {
            "response": response.status,
            ...response.data
        };
        console.log(`\nSubmitted: ${referralCode}, Content: ${JSON.stringify(output, null, 2)}\n`);
        return response.status === 200;
    } catch (error) {
        console.error(`[❌] Error submitting referral code: ${referralCode}`, error.message);
        return false;
    }
}

async function main() {
    const xTitle = "\n\x1b[1mBybit coinsweeper (Auto Referral)\x1b[0m";
    const additionalText = "\nThanks to pentil.pink/bybitcoinsweeper\n";

    console.log(xTitle.green);
    console.log(additionalText.yellow);

    rl.question("[❓] Enter referral code (Telegram ID): ", async (referralCode) => {
        let successCount = 0;

        while (successCount < 5) {
            if (await submitReferral(referralCode)) {
                successCount++;
                console.log(`[✔️] Success ${successCount}/5, [🔄] wait 15s . . .`);
            }
            await new Promise(resolve => setTimeout(resolve, 15000));
        }

        console.log("[✔️] Done!");
        rl.close();
    });
}

main();
