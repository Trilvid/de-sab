const Job = require('../models/jobModel');
const tryCatch = require('./../utils/tryCatch')
const AppError = require('./../utils/AppError');

const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTH_TOKEN;
const twilioNo = process.env.TWILIO_NO;



exports.createNewJob = tryCatch(async (req, res) => {
    
    const usedCodes = new Set();
    function generateUniqueCode(length) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code;
      
      do {
        code = 'DS';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          code += characters.charAt(randomIndex);
        }
      } while (usedCodes.has(code));
      
      usedCodes.add(code);
      return code;
    }

    const trackingID = generateUniqueCode(10);
    console.log(trackingID);

    const newJob = await Job.create({
        project_type: req.body.project_type,
        job_title: req.body.job_title,
        project_description: req.body.project_description,
        amount: req.body.amount,
        installment: req.body.installment,
        client_name: req.body.client_name,
        client_mobile: req.body.client_mobile,
        jobStatus: req.body.jobStatus,
        trackingId: trackingID
    })
    const username =  req.body.client_name.split(' ')[1]

    const client = require('twilio')(accountSid, authToken);
//     const msgText = `Dear ${username}, \n\nDe-Sab Fashion is delighted to have you.\n
// Please your tracking ID is ${trackingID}\nPlease use it to track your order.`

const msgText = `Thank you for your patronage.\nYour tracking ID is ${trackingID}.\n
Please, use it to track your orders at www.de-sab.com/trackorder\n
… Fashion Redefined!`

    client.messages
      .create({
        body: msgText,
        from: 'De-sab',
        to: `+234${req.body.client_mobile}`,
      })
      .then((message) => console.log(message));
    console.log(`sms was sent to ${req.body.client_mobile} ${msgText}`)

    return res.status(201).json({
        message: "new job created",
        data: newJob
    })
})

exports.jobQueueLaundry = tryCatch(async (req, res) => {
    const data = await Job.find().select().where({project_type: 'laundry'})

    res.status(200).json({
        total: data.length,
        data
    })
})

exports.jobQueueLogistics = tryCatch(async (req, res) => {
    const data = await Job.find().select().where({project_type: 'logistics'})

    res.status(200).json({
        total: data.length,
        data
    })
})

exports.jobQueueSewing = tryCatch(async (req, res) => {
    const data = await Job.find().select().where({project_type: 'sewing'})

    res.status(200).json({
        total: data.length,
        data
    })
})

exports.updateAJob = tryCatch(async (req, res) => {

    const data = await Job.findByIdAndUpdate(req.params.jobId, {
        project_type: req.body.project_type,
        job_title: req.body.job_title,
        project_description: req.body.project_description,
        amount: req.body.amount,
        installment: req.body.installment,
        client_name: req.body.client_name,
        client_mobile: req.body.client_mobile
    },{
        new: true,
        runValidators: true,
  })

  if(!data) {
    res.send({
      status: "failed",
      message: "no job with that ID found"
    });
  }

    res.status(201).json({
        data
    })
})

  
exports.acceptJob = tryCatch(async (req, res) => {
    const data = await Job.findByIdAndUpdate(req.params.acceptId, {
        jobStatus: "in progress"
    })

    if(!data) throw new AppError("Not found", "this job does not exits", 401)

    res.status(200).json({
        message: "job accepted"
    })
})
  
exports.completeATask = tryCatch(async (req, res) => {
    const data = await Job.findByIdAndUpdate(req.params.acceptId, {
        jobStatus: "completed"
    })

    if(!data) throw new AppError("Not found", "this job does not exits", 401)

    res.status(200).json({
        message: "job Completed"
    })
})
  
exports.cancelATask = tryCatch(async (req, res) => {
    const data = await Job.findByIdAndUpdate(req.params.acceptId, {
        jobStatus: "cancelled"
    })

    if(!data) throw new AppError("Not found", "this job does not exits", 401)

    res.status(200).json({
        message: "job Cancelled"
    })
})

exports.trackJobProgress = tryCatch(async (req, res) => {
    const data = await Job.findOne({trackingId: req.body.trackingId})

    if(!data) {
        throw new AppError("Not Found", "this tracking id is invalid ", 400)
    }

    return res.status(200).json({
        status: data.jobStatus,
        data
    })
})



// 2. Total job completed by any given sewer, logistic dispatcher, laundry attendant

// 4. Total amount due for all job completed in a given time range by job type. 

// 5. Total amount due for job completed by individual worker

// 6. Client information sheet.

// 7. Any other that you may consider necessary.

exports.reportGeneration = tryCatch(async (req, res) => {
    const totalJobsInProgress = await Job.find().where({jobStatus: "in progress"})
    const totalJobsOrders = await Job.find()
    const totalAmt = await Job.find().select('amount')

    res.status(200).json({
        total_amount: totalAmt.length,
        total_orders: totalJobsOrders.length,
        jobs_in_progress: totalJobsInProgress.length
    })
})