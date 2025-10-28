import React from 'react'

export default function InfoPage(){
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      <section>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">About Cribly</h1>
        <p className="text-gray-700">Cribly connects renters, landlords, and roommates with verified profiles, secure messaging, and safety-first verification.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">How it works</h2>
        <ol className="list-decimal pl-5 text-gray-700 space-y-1">
          <li>Create an account and complete identity verification.</li>
          <li>Browse listings or find a compatible roommate.</li>
          <li>Save favorites and contact owners safely through the platform.</li>
        </ol>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Safety</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>We use AWS Rekognition based checks for face match and basic document signals.</li>
          <li>Report suspicious activity; we review and take action promptly.</li>
          <li>Meet in public spaces for viewings and never transfer money outside the platform.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Help Center</h2>
        <p className="text-gray-700">Need assistance? Visit our Help Center or contact support at support@cribly.com.</p>
      </section>
    </div>
  )
}



