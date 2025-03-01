const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  image: { type: String, default: null },
  password: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  mobile: { type: String, required: true }, 
  position: { type: String, required: true }, 
  role: { type: String, required: true },
  allowedPages: { type: [String], default: [] },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'Restricted'],
    default: 'active' 
  },
  isSuperAdmin: { type: Boolean, default: false },
  isRestricted: { type: Boolean, default: false }
});

AdminSchema.pre('save', async function(next) {
  if (this.isSuperAdmin) {
    const existingSuperAdmin = await this.constructor.findOne({ isSuperAdmin: true });
    if (existingSuperAdmin && existingSuperAdmin._id.toString() !== this._id.toString()) {
      return next(new Error('Only one super admin allowed.'));
    }
  }
  next();
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;