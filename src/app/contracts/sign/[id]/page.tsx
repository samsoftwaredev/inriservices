"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { ContractSigningPage } from "@/components/ContractSigning";
import { SigningStateScreen } from "@/components/ContractSigning";
import { createDemoAgreement } from "@/components/ContractSigning/types";
import {
  defaultContractValues,
  ContractFormData,
} from "@/components/ContractGenerator/types";

/**
 * Public-facing agreement signing page.
 *
 * In production, this page would:
 * 1. Fetch the agreement by ID from the backend
 * 2. Validate the link (expired, cancelled, etc.)
 * 3. Pass the real agreement data to ContractSigningPage
 *
 * For now it uses demo data so the full signing UX can be previewed.
 */
const SignContractPage = () => {
  const params = useParams<{ id: string }>();

  // Demo: build a sample agreement with pre-filled contract data
  const agreement = useMemo(() => {
    const sampleData: ContractFormData = {
      ...defaultContractValues,
      agreementDate: new Date().toISOString().split("T")[0],
      clientName: "John Smith",
      clientAddress: "1234 Elm Street, Dallas, TX 75201",
      clientPhone: "(214) 555-0199",
      clientEmail: "john.smith@email.com",
      typeOfProject: "Interior Painting",
      customerDetails:
        "Full interior repaint of 3-bedroom home. Client requests neutral tones throughout. Living room accent wall in navy blue.",
      areasRooms: "Living Room, Kitchen, Master Bedroom, 2 Bedrooms, Hallway",
      prepWork: "Sanding, patching nail holes, priming dark walls",
      numberOfCoats: "2",
      paintBrand: "Sherwin-Williams Duration",
      exclusions: "Garage, exterior surfaces, and bathroom ceilings",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      completionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      workStartTime: "08:00",
      workEndTime: "17:00",
      totalCost: "4500",
      depositAmount: "1500",
      warrantyMonths: "6",
      clientSignatureName: "John Smith",
      contractorName: "Samuel / INRI Paint & Wall LLC",
    };

    const agr = createDemoAgreement(sampleData);
    agr.id = params.id || agr.id;
    agr.signerName = sampleData.clientName;
    agr.signerEmail = sampleData.clientEmail;
    return agr;
  }, [params.id]);

  // In production: if fetch fails, show invalid state
  if (!params.id) {
    return <SigningStateScreen status="invalid" />;
  }

  return <ContractSigningPage agreement={agreement} />;
};

export default SignContractPage;
