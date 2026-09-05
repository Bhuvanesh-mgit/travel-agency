import Enquiry from '../models/enquiryModel.js';


import { GoogleGenAI } from '@google/genai';

// Initialize Gemini SDK (uses process.env.GEMINI_API_KEY)
const ai = new GoogleGenAI();

// @desc    Submit a new customer enquiry
// @route   POST /api/enquiries
// @access  Public
export const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, packageId, subject, message } = req.body;

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      package: packageId || null,
      subject: subject || 'General Inquiry',
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Your enquiry has been submitted. Our team will contact you shortly!',
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all enquiries (with filter by status)
// @route   GET /api/enquiries
// @access  Private (Admin & Staff)
export const getAllEnquiries = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const enquiries = await Enquiry.find(query)
      .populate('package', 'title price locationName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single enquiry by ID
// @route   GET /api/enquiries/:id
// @access  Private (Admin & Staff)
export const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id).populate('package', 'title price');

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.json({ success: true, data: enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update enquiry status or internal staff notes
// @route   PUT /api/enquiries/:id
// @access  Private (Admin & Staff)
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { status, staffNotes } = req.body;

    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    if (status) enquiry.status = status;
    if (staffNotes !== undefined) enquiry.staffNotes = staffNotes;

    await enquiry.save();

    res.json({
      success: true,
      message: 'Enquiry updated successfully',
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private (Admin Only)
export const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔑 NEW: Handle AI Chat/Enquiry inside your existing controller file
export const handleAiEnquiry = async (req, res) => {
  try {
    const { message, packageTitle, allPackages } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Format your database inventory list cleanly for the AI model
    const catalogSummary = Array.isArray(allPackages) && allPackages.length > 0
      ? allPackages.map(p => `• Package: "${p.title}" | Location: ${p.location || p.destination || 'Global'} | Price: $${p.price} | Duration: ${p.duration || 'Flexible'} | Itinerary: ${p.itinerary || 'Available'}`).join('\n')
      : 'No packages loaded in catalog context.';

    const systemPrompt = `
      You are an expert, friendly AI Travel Assistant for "TravelGo", a premier travel booking agency. 
      You help customers with tour enquiries, destination details, pricing, and itinerary questions based strictly on our live database inventory.

      Current User Context: The user is browsing the Home page / inquiring about "${packageTitle}".

      Here is our complete live database catalog of tour packages:
      ${catalogSummary}

      Instructions:
      - Answer customer questions accurately using the package titles, exact prices, destinations, and details from the catalog above.
      - If a user asks for recommendations, prices, or destinations, suggest specific packages from this database list.
      - Keep responses professional, helpful, engaging, and concise.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `${systemPrompt}\n\nCustomer Message: ${message}`,
    });

    res.status(200).json({
      success: true,
      reply: response.text,
    });
  } catch (error) {
    console.error('DETAILED AI ERROR:', error);
    res.status(500).json({ success: false, message: 'Failed to process AI chat response' });
  }
};