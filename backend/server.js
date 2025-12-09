const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Enable CORS for all origins (in production, you should restrict this)
app.use(cors({
  origin: true,
  credentials: true
}));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'IOIO Backend is running!' });
});

// POST endpoint for properties
app.post('/api/properties', async (req, res) => {
  try {
    console.log('Received property data:', req.body);
    
    // Validate required fields
    const requiredFields = ['name', 'age', 'email', 'phone', 'property_type', 'message'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields', 
        missingFields 
      });
    }
    
    // Only include fields that exist in the Supabase schema
    const property = { 
      name: req.body.name,
      age: parseInt(req.body.age),
      email: req.body.email,
      phone: req.body.phone,
      property_type: req.body.property_type,
      bedrooms: req.body.bedrooms || null,
      rooms: req.body.rooms || null,
      message: req.body.message,
      created_at: new Date() 
    };
    
    console.log('Inserting property:', property);
    
    const { data, error } = await supabase
      .from('properties')
      .insert([property])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error submitting property', 
        error: error.message,
        details: error
      });
    }

    res.status(200).json({ success: true, message: 'Property submitted', data });
  } catch (error) {
    console.error('Unexpected error inserting property:', error);
    res.status(500).json({ success: false, message: 'Unexpected error submitting property', error: error.message });
  }
});

// GET endpoint for properties
app.get('/api/properties', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching properties', 
        error: error.message 
      });
    }

    res.status(200).json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Unexpected error fetching properties:', error);
    res.status(500).json({ success: false, message: 'Unexpected error fetching properties', error: error.message });
  }
});

// POST endpoint for services
app.post('/api/service', async (req, res) => {
  try {
    console.log('Received service data:', req.body);
    
    // Validate required fields
    const requiredFields = ['name', 'age', 'email', 'phone', 'service_type', 'message'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields', 
        missingFields 
      });
    }
    
    // Only include fields that exist in the Supabase schema
    const service = { 
      name: req.body.name,
      age: parseInt(req.body.age),
      email: req.body.email,
      phone: req.body.phone,
      service_type: req.body.service_type,
      beauty_type: req.body.beauty_type || null,
      message: req.body.message,
      created_at: new Date() 
    };
    
    console.log('Inserting service:', service);
    
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error submitting service', 
        error: error.message,
        details: error,
        requestData: service
      });
    }

    res.status(200).json({ success: true, message: 'Service submitted', data });
  } catch (error) {
    console.error('Unexpected error inserting service:', error);
    res.status(500).json({ success: false, message: 'Unexpected error submitting service', error: error.message });
  }
});

// GET endpoint for services
app.get('/api/service', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching services', 
        error: error.message 
      });
    }

    res.status(200).json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Unexpected error fetching services:', error);
    res.status(500).json({ success: false, message: 'Unexpected error fetching services', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📊 Supabase URL: ${supabaseUrl}`);
});