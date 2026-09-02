import Enquiry from '../models/enquiryModel.js';

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