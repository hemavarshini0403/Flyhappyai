import { Link } from "react-router";
import { Plane, FileText, Search, MessageSquare, Shield, Zap, Brain, Globe } from "lucide-react";
import { useEffect } from "react";
import { initializeSampleData } from "../utils/storage";

export default function Home() {
  useEffect(() => {
    // Initialize sample data on first load
    initializeSampleData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              FlyHappy
            </h1>
            <p className="text-2xl mb-4">
              Instant Complaint Resolution for Stress-Free Air Travel
            </p>
            <p className="text-xl text-indigo-100 mb-8">
              AI-Powered Airline Grievance Redressal System
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/register"
                className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                File a Complaint
              </Link>
              <Link
                to="/track"
                className="px-8 py-3 bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-800 transition-colors"
              >
                Track Status
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
              <Brain className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Classification</h3>
            <p className="text-gray-600">
              Automatically categorize complaints using NLP and machine learning for faster resolution.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
              <Zap className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">OCR Document Reading</h3>
            <p className="text-gray-600">
              Upload boarding pass or ticket images and auto-fill details using OCR technology.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
              <Globe className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multilingual Support</h3>
            <p className="text-gray-600">
              File complaints in your preferred language with translation support.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
              <MessageSquare className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Chatbot Assistant</h3>
            <p className="text-gray-600">
              Get instant help and guidance through our AI-powered chatbot assistant.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
              <Search className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
            <p className="text-gray-600">
              Track your complaint status with detailed progress updates and timelines.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
              <Shield className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Priority Prediction</h3>
            <p className="text-gray-600">
              Smart priority assignment ensures urgent complaints get immediate attention.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-full mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Register Complaint</h3>
              <p className="text-sm text-gray-600">
                Fill the form or upload documents to auto-populate details
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-full mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p className="text-sm text-gray-600">
                System classifies and assigns priority automatically
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-full mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Admin Review</h3>
              <p className="text-sm text-gray-600">
                Complaint is reviewed and processed by airline team
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-full mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Resolution</h3>
              <p className="text-sm text-gray-600">
                Track progress and receive resolution updates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">95%</div>
            <div className="text-gray-600">Classification Accuracy</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">2hrs</div>
            <div className="text-gray-600">Average Response Time</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">10+</div>
            <div className="text-gray-600">Airlines Supported</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Have a Complaint? We're Here to Help
          </h2>
          <p className="text-xl text-indigo-100 mb-6">
            Get your airline grievances resolved quickly and efficiently
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            File Your Complaint Now
          </Link>
        </div>
      </div>
    </div>
  );
}
