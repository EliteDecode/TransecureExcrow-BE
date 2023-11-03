const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminNoticeSchema = new Schema(
  {
    title: {
      type: String,
    },
    description: [
        { 
            type: Schema.Types.ObjectId,
            ref: 'Messages' 
        }
    ],
    status: {
      type: String,
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

// AdminNoticeSchema.pre("validate", function (next) {
//   if (this.name) {
//     this.catSlug = slugify(this.name, {
//       lower: true,
//       strict: true,
//     });
//   }

//   next();
// });

// const populateOrganization = function (next) {
//   this.populate("organization", "_id name email");

//   next();
// };

// AdminNoticeSchema.pre("find", populateOrganization)
//   .pre("findOne", populateOrganization)
//   .pre("findOneAndUpdate", populateOrganization);

  const AdminNotice = mongoose.model("AdminNotice", AdminNoticeSchema);
  module.exports = AdminNotice;