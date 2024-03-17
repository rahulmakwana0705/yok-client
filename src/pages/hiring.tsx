import React, { useState } from "react";
import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";

const JobOpening = ({ title, location, experience, description, onSubmit }) => {
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleSubmission = () => {
    // You can perform any action with the submitted data
    onSubmit({
      title,
      location,
      experience,
      fullName,
      address,
      workExperience,
      coverLetter,
    });
    // Close the popup after submission
    setIsPopupOpen(false);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-lg">
        <strong>Location:</strong> {location}
      </p>
      <p className="text-lg">
        <strong>Experience:</strong> {experience}
      </p>
      <p className="text-lg">{description}</p>
      <button
        onClick={() => setIsPopupOpen(true)}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Apply Now
      </button>

      {/* Popup Form */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 w-96">
            <h2 className="text-2xl font-bold mb-4">Submit Your Application</h2>
            <div className="mt-4">
              <label
                htmlFor={`fullName-${title}`}
                className="block text-lg font-semibold"
              >
                Full Name:
              </label>
              <input
                type="text"
                id={`fullName-${title}`}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border p-2 mt-1 w-full"
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor={`address-${title}`}
                className="block text-lg font-semibold"
              >
                Address:
              </label>
              <input
                type="text"
                id={`address-${title}`}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border p-2 mt-1 w-full"
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor={`workExperience-${title}`}
                className="block text-lg font-semibold"
              >
                Work Experience:
              </label>
              <textarea
                id={`workExperience-${title}`}
                value={workExperience}
                onChange={(e) => setWorkExperience(e.target.value)}
                className="border p-2 mt-1 w-full resize-none"
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor={`coverLetter-${title}`}
                className="block text-lg font-semibold"
              >
                Cover Letter:
              </label>
              <textarea
                id={`coverLetter-${title}`}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="border p-2 mt-1 w-full resize-none"
              />
            </div>
            <button
              onClick={handleSubmission}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit Application
            </button>
            <button
              onClick={() => setIsPopupOpen(false)}
              className="mt-4 ml-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const HiringPage = () => {
  const handleApplicationSubmission = (applicationData) => {
    // Perform any action with the application data (e.g., send to server, store in state)
    console.log("Application Submitted:", applicationData);
  };

  return (
    <>
      <Container>
        <div className="pt-8">
          <h1 className="text-3xl font-bold mb-5">Join Our Team!</h1>
          <JobOpening
            title="Sales Head"
            location="Mumbai/Tiruppur"
            experience="5 years"
            description="We are searching for an accomplished Sales Head to lead our sales team in Mumbai. With a proven record of at least 5 years in sales leadership, you will be instrumental in formulating and executing sales strategies that align with our business goals."
            onSubmit={handleApplicationSubmission}
          />
          <JobOpening
            title="Sales Executive"
            location="Mumbai"
            experience="1 year"
            description="We are looking for a motivated Sales Executive to join our team at our Mumbai office. With a minimum of 1 year of sales experience, you will play a crucial role in generating leads, building client relationships, and driving revenue growth."
            onSubmit={handleApplicationSubmission}
          />
          <JobOpening
            title="T-shirt Designer"
            location="Tiruppur"
            experience="1 year"
            description="We are seeking a creative T-Shirt Designer to join our team at our Tirupur location. With at least 1 year of experience in T-Shirt design, you will be responsible for conceptualizing and creating unique and appealing designs that align with our brand and customer preferences."
            onSubmit={handleApplicationSubmission}
          />
        </div>
      </Container>
    </>
  );
};

HiringPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        "common",
        "forms",
        "menu",
        "footer",
      ])),
    },
  };
};

export default HiringPage;
