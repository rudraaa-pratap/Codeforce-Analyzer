import express from "express";

const app = express();

app.use(express.static("public"));

// API route
app.get("/api/user/:handle", async (req, res) => {
    const handle = req.params.handle;

    try {
        // Fetch user info
        const infoRes = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
        const infoData = await infoRes.json();

        // Fetch submissions
        const subRes = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
        const subData = await subRes.json();

        // Fetch contest history
        const contestRes = await fetch(`https://codeforces.com/api/user.rating?handle=${handle}`);
        const contestData = await contestRes.json();

        if (infoData.status !== "OK") {
            return res.json({ error: "User not found" });
        }

        const user = infoData.result[0];
        const submissions = subData.result;

        // Solve count
        const solvedSet = new Set();
        const tagCount = {};

        submissions.forEach(sub => {
            if (sub.verdict === "OK") {
                const key = sub.problem.contestId + "-" + sub.problem.index;
                solvedSet.add(key);

                sub.problem.tags.forEach(tag => {
                    tagCount[tag] = (tagCount[tag] || 0) + 1;
                });
            }
        });

        res.json({
            handle: user.handle,
            rating: user.rating || "Unrated",
            maxRating: user.maxRating || "N/A",
            contests: contestData.result.length,
            solved: solvedSet.size,
            tags: tagCount
        });

    } catch (err) {
        res.json({ error: "Something went wrong" });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});