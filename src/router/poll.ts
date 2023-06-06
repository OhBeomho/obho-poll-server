import { Router } from "express";
import { wrap } from "./wrap";
import Poll from "../db/schema/Poll";
import { compareSync, hashSync } from "bcrypt";

const router = Router();

router.get(
  "/:pollId",
  wrap(async (req, res) => {
    const { pollId } = req.params;
    const poll = await Poll.findById(pollId);

    if (!poll) {
      res.status(404).json({ code: 404, error: "Poll not found." });
      return;
    }

    res.json({ code: 200, poll });
  })
);

router.post(
  "/vote/:pollId",
  wrap(async (req, res) => {
    const { pollId } = req.params;
    const { option, ip } = req.body;
    const poll = await Poll.findById(pollId).orFail(new Error("Poll not found."));

    if (poll.options.length < Number(option)) {
      throw new Error(`The poll has only ${poll.options.length} options.`);
    } else if (!poll.open) {
      throw new Error("The poll is closed.");
    } else if (poll.voters.includes(ip)) {
      throw new Error("You already voted.");
    }

    poll.votes.push(Number(option));
    poll.voters.push(ip);
    await poll.save();

    res.setHeader("Access-Control-Allow-Origin", "https://obho-poll.netlify.app");
    res.json({ code: 200 });
  })
);

router.post(
  "/create",
  wrap(async (req, res) => {
    const { name, description, options, password } = req.body;
    const pollId = (
      await Poll.create({
        name,
        options,
        description,
        password: hashSync(password, 10)
      })
    )._id;

    res.json({ code: 200, pollId });
  })
);

router.get(
  "/close/:pollId/:password",
  wrap(async (req, res) => {
    const { pollId, password } = req.params;
    const poll = await Poll.findById(pollId).orFail(new Error("Poll not found."));

    if (!compareSync(password, poll.password)) {
      res.status(401).send({ code: 401, error: "Incorrect password." });
      return;
    }

    poll.open = false;
    await poll.save();

    res.json({ code: 200 });
  })
);

router.delete(
  "/:pollId/:password",
  wrap(async (req, res) => {
    const { pollId, password } = req.params;
    const poll = await Poll.findById(pollId).orFail(new Error("Poll not found."));

    if (!compareSync(password, poll.password)) {
      res.status(401).send({ code: 401, error: "Incorrect password." });
      return;
    }

    await Poll.findByIdAndDelete(pollId);

    res.json({ code: 200 });
  })
);

export default router;
