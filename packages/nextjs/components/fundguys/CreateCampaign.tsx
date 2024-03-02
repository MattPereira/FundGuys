"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { parseEther } from "viem";
import { Select, TextField } from "~~/components/fundguys/";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const preferredTokenOptions = [
  { value: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", label: "USDC" },
  { value: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", label: "DAI" },
  { value: "0x4200000000000000000000000000000000000006", label: "WETH" },
];

export const CreateCampaign = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient ? (
    <>
      <button
        className="link link-accent text-2xl"
        onClick={() => {
          const modal = document.getElementById("campaign_modal");
          if (modal instanceof HTMLDialogElement) {
            modal.showModal();
          }
        }}
      >
        create a campaign
      </button>
      <CreateCampaignModal />
    </>
  ) : (
    "loading..."
  );
};

const CreateCampaignModal = () => {
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
      console.log("data", data);
      // convert human-readable date to unix timestamp
      const date = new Date(data.deadline);
      const deadline = BigInt(Math.floor(date.getTime() / 1000));
      // Write to the contract
      await createProject({
        args: [
          data.name,
          data.description,
          data.preferredToken, // HARDCODED wETH MUST CHANGE FOR BASE
          parseEther(data.targetAmount),
          deadline,
          data.image,
        ],
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
      <div className="modal-box bg-base-200 p-8 w-full">
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
          <Select
            id="preferredToken"
            label="Preferred Token"
            placeholder="Choose a token"
            options={preferredTokenOptions}
            register={register}
            validations={{
              required: "Please choose a preferred Token",
            }}
            errors={errors.gradeLevel}
          />

          <button className="btn btn-lg btn-accent text-2xl font-normal font-cubano w-full mt-5 mb-2">Submit</button>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
