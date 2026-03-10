import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, FileText, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { extractTextFromImage } from "../utils/ocr";
import { classifyComplaint, getCategoryDisplayName } from "../utils/classifier";
import { EmergencyLevel, getEmergencyLevelLabel, predictPriority } from "../utils/priority";
import { saveComplaint, generateComplaintId } from "../utils/storage";

export default function RegisterComplaint() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    passengerName: "",
    email: "",
    phone: "",
    pnr: "",
    flightNumber: "",
    airline: "",
    source: "",
    destination: "",
    dateOfTravel: "",
    description: "",
    emergencyLevel: 3 as EmergencyLevel,
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrData, setOcrData] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "emergencyLevel" ? Number(value) : value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setOcrLoading(true);

    try {
      const result = await extractTextFromImage(file);

      if (result.success && result.detectedFields) {
        // Auto-fill form fields from OCR
        setFormData((prev) => ({
          ...prev,
          passengerName: result.detectedFields?.passengerName || prev.passengerName,
          pnr: result.detectedFields?.pnr || prev.pnr,
          flightNumber: result.detectedFields?.flightNumber || prev.flightNumber,
          airline: result.detectedFields?.airline || prev.airline,
          source: result.detectedFields?.source || prev.source,
          destination: result.detectedFields?.destination || prev.destination,
          dateOfTravel: result.detectedFields?.date || prev.dateOfTravel,
        }));

        setOcrData(result.extractedText);
        toast.success("Document scanned successfully! Fields auto-filled.");
      } else {
        toast.error(result.error || "Failed to extract text from document");
      }
    } catch (error) {
      toast.error("Error processing document");
    } finally {
      setOcrLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.passengerName || !formData.email || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      // Classify complaint using AI
      const classification = classifyComplaint(formData.description);

      // Predict priority
      const priorityResult = predictPriority(
        formData.description,
        classification.category,
        undefined,
        formData.emergencyLevel
      );

      // Create complaint object
      const complaintId = generateComplaintId();
      const complaint = {
        id: complaintId,
        ...formData,
        complaintType: classification.category,
        priority: priorityResult.priority,
        emergencyLevel: formData.emergencyLevel,
        status: "submitted" as const,
        uploadedFiles: uploadedFile ? [uploadedFile.name] : [],
        ocrData: ocrData || undefined,
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to storage
      saveComplaint(complaint);

      toast.success("Complaint submitted successfully!");

      // Show classification results
      setTimeout(() => {
        toast.info(
          `AI Classification: ${getCategoryDisplayName(classification.category)} (${Math.round(classification.confidence * 100)}% confidence)`,
          { duration: 5000 }
        );
      }, 500);

      setTimeout(() => {
        toast.info(`Priority Level: ${priorityResult.priority.toUpperCase()}`, {
          duration: 5000,
        });
      }, 1000);

      if (formData.emergencyLevel === 5) {
        setTimeout(() => {
          toast.info("Emergency Level 5 selected: marked as very important.", {
            duration: 5000,
          });
        }, 1500);
      }

      // Redirect to tracking page
      setTimeout(() => {
        navigate(`/track?id=${complaintId}`);
      }, 2000);
    } catch (error) {
      toast.error("Failed to submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Register Your Complaint
          </h1>
          <p className="text-gray-600">
            Fill in the details below or upload your boarding pass/ticket to auto-fill
          </p>
        </div>

        {/* OCR Upload Section */}
        <div className="mb-8 p-6 bg-indigo-50 border border-indigo-200 rounded-lg">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Upload className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quick Upload - Auto-fill Details
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload your boarding pass, e-ticket, or invoice to automatically extract details
              </p>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={ocrLoading}
                  />
                  <div className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2">
                    {ocrLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        <span>Choose File</span>
                      </>
                    )}
                  </div>
                </label>
                {uploadedFile && (
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>{uploadedFile.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Complaint Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Passenger Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Passenger Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passenger Name *
                </label>
                <input
                  type="text"
                  name="passengerName"
                  value={formData.passengerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="+91-9876543210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PNR Number
                </label>
                <input
                  type="text"
                  name="pnr"
                  value={formData.pnr}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="ABC123XYZ"
                />
              </div>
            </div>
          </div>

          {/* Flight Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Flight Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Flight Number
                </label>
                <input
                  type="text"
                  name="flightNumber"
                  value={formData.flightNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="AI-342"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Airline
                </label>
                <select
                  name="airline"
                  value={formData.airline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select Airline</option>
                  <option value="Air India">Air India</option>
                  <option value="IndiGo">IndiGo</option>
                  <option value="SpiceJet">SpiceJet</option>
                  <option value="Vistara">Vistara</option>
                  <option value="Go First">Go First</option>
                  <option value="AirAsia India">AirAsia India</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source (From)
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Delhi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination (To)
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Travel
                </label>
                <input
                  type="date"
                  name="dateOfTravel"
                  value={formData.dateOfTravel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Complaint Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaint Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Describe Your Complaint *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Please provide detailed information about your complaint including what happened, when it occurred, and any other relevant details..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Our AI will automatically categorize your complaint and assign priority
              </p>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Emergency Level
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((level) => {
                  const isSelected = formData.emergencyLevel === level;
                  return (
                    <label
                      key={level}
                      className={`cursor-pointer rounded-lg border px-3 py-4 text-center transition-colors ${
                        isSelected
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-indigo-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="emergencyLevel"
                        value={level}
                        checked={isSelected}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="text-lg font-bold">{level}</div>
                      <div className="text-xs mt-1">{getEmergencyLevelLabel(level as EmergencyLevel)}</div>
                    </label>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Level 5 is treated as very important and gets immediate attention in the
                system.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Complaint</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
