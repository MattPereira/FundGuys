"use client";

import { useForm } from "react-hook-form";
import { useAccount } from "wagmi";
import { TextField } from "~~/components/fundguys/TextField";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const CreateCampaign = () => {
  return (
    <>
      <button
        className="btn btn-lg btn-accent w-60 text-2xl font-normal font-cubano"
        onClick={() => {
          const modal = document.getElementById("campaign_modal");
          if (modal instanceof HTMLDialogElement) {
            modal.showModal();
          }
        }}
      >
        Create
      </button>
      <CreateCampaignModal />
    </>
  );
};

const CreateCampaignModal = () => {
  const { address: connectedAddress } = useAccount();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { writeAsync: createProject } = useScaffoldContractWrite({
    contractName: "PublicGoodsFunding",
    functionName: "createProject",
    args: [undefined, undefined, undefined, undefined, undefined, undefined],
  });

  const onSubmit = async (data: any) => {
    try {
      // convert human-readable date to unix timestamp
      const date = new Date(data.deadline);
      const unixTimestamp = BigInt(Math.floor(date.getTime() / 1000));
      // Write to the contract
      await createProject({
        args: [connectedAddress, data.name, data.description, data.targetAmount, unixTimestamp, data.image],
      });
      reset(); // clear form inputs

      const modal = document.getElementById("campaign_modal");
      if (modal instanceof HTMLDialogElement) {
        modal.close();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <dialog id="campaign_modal" className="modal">
      <div className="modal-box bg-base-200 border-base-300 border-2 p-8 w-full">
        <div className="flex justify-center items-center mb-5">
          <h3 className="font-normal font-cubano text-4xl text-center">Create</h3>
        </div>
        <form method="dialog" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
          <TextField
            id="name"
            label="Name"
            type="text"
            placeholder="DeFi Do-Gooders"
            register={register}
            validations={{ required: "Please provide your name" }}
            errors={errors.name}
          />
          <TextField
            id="image"
            label="Image URL"
            type="text"
            placeholder="https://example.com/image.jpg"
            register={register}
            validations={{ required: "Please provide an image URL" }}
            errors={errors.name}
          />
          <TextField
            id="description"
            label="Description"
            type="textarea"
            placeholder="Your goals and how funds will be spent"
            register={register}
            validations={{ required: "Please provide a description" }}
            errors={errors.name}
          />
          <TextField
            id="targetAmount"
            label="Target Amount"
            type="text"
            placeholder="420"
            register={register}
            validations={{ required: "Please provide your funding goal" }}
            errors={errors.name}
          />
          <TextField
            id="deadline"
            label="Deadline"
            type="date"
            placeholder=""
            register={register}
            validations={{
              required: "Please provide a campaign end date",
            }}
            errors={errors.birthdate}
          />

          <button
            onClick={() => console.log("clicked")}
            className="btn btn-lg btn-accent text-2xl font-normal font-cubano w-full mt-5 mb-2"
          >
            Submit
          </button>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
