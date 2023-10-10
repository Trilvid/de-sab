const Job = require('../models/jobModel');
const tryCatch = require('./../utils/tryCatch')
const AppError = require('./../utils/AppError');

const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTH_TOKEN;

exports.getAllJobsForEdit = tryCatch(async (req, res) => {
    const allJobs = await Job.find()

    if(!allJobs) {
        throw new AppError('Not Found', 'there is no Job on this Queue', 400)
    }

    res.json({allJobs})
})

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

const msgText = `Thank you for booking us.\nYour tracking ID is ${trackingID}\n
Please, use it to track your orders.\nwww.de-sab.com  ... Fashion Redefined!.`

// const msgText = `Thank you for your patronage.\nYour tracking ID is ${trackingID}.\n
// Please, use it to track your orders at www.de-sab.com/trackorder\n
// … Fashion Redefined!`


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
// 5. Total amount due for job completed by individual worker
// 7. Any other that you may consider necessary.

exports.reportGeneration = tryCatch(async (req, res) => {
    const totalJobsInProgress = await Job.find().where({jobStatus: "in progress"})
    const totalJobsOrders = await Job.find()
    const totalAmt = await Job.find().select('amount').where({jobStatus: "completed"})
    const totalAmtInProgress = await Job.find().select('amount').where({jobStatus: "in progress"})
    const totalAmtPending = await Job.find().select('amount').where({jobStatus: "pending"})
    const clients = await Job.find().select(['client_name', 'project_type', 'job_title', 'amount', 'installment'])
    
    let totalAmount = 0;
    let totalPending = 0;
    let totalAmountInPro = 0;

    for (const doc of totalAmt) {
      if (doc.amount) {
        totalAmount += doc.amount;
      }
    }

    for (const doc of totalAmtInProgress) {
        if (doc.amount) {
            totalAmountInPro += doc.amount;
        }
      }
      
    for (const doc of totalAmtPending) {
        if (doc.amount) {
            totalPending += doc.amount;
        }
      }
      

    res.status(200).json({
        total_amount: totalAmount,
        total_amount_inProgress: totalAmountInPro,
        total_amount_pending: totalPending,
        total_orders: totalJobsOrders.length,
        jobs_in_progress: totalJobsInProgress.length,
        clients
    })
})