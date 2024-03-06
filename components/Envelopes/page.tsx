"use client";

import { useState, useEffect } from "react";
import { InfinitySpin } from "react-loader-spinner";

const URL = process.env.NEXT_PUBLIC_SIGNABLE_URL as string;
const AUTH = process.env.NEXT_PUBLIC_SIGNABLE_AUTH as string;

const Envelopes = () => {
  const [signedEnvelopes, setSignedEnvelopes] = useState([]);
  const [unsignedEnvelopes, setUnsignedEnvelopes] = useState([]);
  const [uploadedEnvelope, setUploadedEnvelope] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Cache this API
    const getEnvelopes = async () => {
      await fetch(`${URL}/envelopes?offset=0&limit=50`, {
        headers: {
          Authorization: AUTH,
        },
      }).then(async (data) => {
        const response = await data.json();

        const envelopes = response.envelopes;

        // check if signed
        const signed = envelopes.filter((envelope: any) => {
          return envelope.envelope_status === "sent";
        });
        setSignedEnvelopes(signed);

        // check if not signed
        const unsigned = envelopes.filter((envelope: any) => {
          return envelope.envelope_status !== "sent";
        });
        setUnsignedEnvelopes(unsigned);

        return response;
      });
    };
    getEnvelopes();
  }, []);

  const uploadEnvelope = async () => {
    setShowLoader(true);

    try {
      const response = await fetch(`${URL}/envelopes`, {
        method: "POST",
        headers: {
          Authorization: AUTH,
        },
        body: JSON.stringify({
          envelope_title: "Example Envelope from Template - System Upload",
          envelope_documents: [
            {
              document_title: "Autoserve Ltd GM Contract T&C",
              document_template_fingerprint: "6c81a222ae7da0196b08f25339f35423",
            },
          ],
          envelope_parties: [
            {
              party_name: "Signer 1",
              party_email: "jo@example.com",
              party_id: "10375628",
              party_role: "signer",
              party_message: "hello world",
            },
          ],
        }),
      }).then((data) => {
        console.log(data);
        setUploadedEnvelope(true);
      });
      console.log("Download complete", response);
    } catch (error) {
      console.error(`Download error: ${error.message}`);
    }

    setShowLoader(false);
  };

  return (
    <div className="p-5">
      <section className="bg-gray-200 p-5 mb-3">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900">
          Upload Envelope
        </h1>
        <p className="pb-2">Upload envelope using existing template...</p>
        {showLoader ? (
          <InfinitySpin
            visible={true}
            width="200"
            color="#3b82f6"
            ariaLabel="infinity-spin-loading"
          />
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => uploadEnvelope()}
          >
            Upload
          </button>
        )}
        {uploadedEnvelope && (
          <p className="text-green-500 font-bold mt-2">Envelope uploaded successfully!</p>
        )}
      </section>

      <section className="bg-gray-200 p-5 mb-3">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900">
          Signed Envelopes
        </h1>
        {signedEnvelopes.length > 0 && (
          <ul className="list-disc ml-5">
            {signedEnvelopes.map((envelope) => {
              return (
                <li key={envelope.envelope_fingerprint}>
                  {envelope.envelope_title}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="bg-gray-200 p-5">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900">
          Unsigned Envelopes
        </h1>
        {signedEnvelopes.length > 0 && (
          <ul className="list-disc ml-5">
            {unsignedEnvelopes.map((envelope) => {
              return (
                <li key={envelope.envelope_fingerprint}>
                  {envelope.envelope_title}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Envelopes;
