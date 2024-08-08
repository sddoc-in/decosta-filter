import express from "express";
import CreateSequence from "../API/Create";
import UpdateSequence from "../API/Update";
import DeleteSequence from "../API/Delete";
import Get from "../API/Get";

const SequenceRouter = express.Router();

SequenceRouter.get("/",new Get().getOne);
SequenceRouter.get("/all",new Get().getAll);
SequenceRouter.get("/tables",new Get().getAllSeqFor);
SequenceRouter.post("/create",new CreateSequence().create); 
SequenceRouter.put("/update",new UpdateSequence().updateSequence);
SequenceRouter.delete("/delete",new DeleteSequence().deleteSequence);

export default SequenceRouter;
