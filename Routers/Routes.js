const { getAdminOffer, addAdminOffer, updateAdminOffer } = require('../Controllers/AttrAdminOffersController');
const { getAdminSettings, addAdminSettings, updateAdminSetting } = require('../Controllers/AttrAdminSettingsController');
const { getGeneralPages, addGeneralPages, updateGeneralPages } = require('../Controllers/AttrGeneralPagesController');
const { getStateDistrict } = require('../Controllers/AttrStateDistrictsController');
const { getExecutiveDeviceToken, addExecutiveDeviceToken, updateExecutiveDeviceToken } = require('../Controllers/ExecutiveDeviceTokensController');
const { getExecutiveNotification, addExecutiveNotification, updateExecutiveNotification } = require('../Controllers/ExecutiveNotificationsController');
const { getFaq, addFaq, updateFaq } = require('../Controllers/FaqsController');
const { getOrderPayments, addOrderPayments, updateOrderPayments } = require('../Controllers/OrderPaymentsController');
const { getOrderProductType, addOrderProductType, updateOrderProductType } = require('../Controllers/OrderProductTypesController');
const { getOrder, addOrder, updateOrder } = require('../Controllers/OrdersController');
const { getPersonalAccessToken, addPersonalAccessToken, updatePersonalAccessToken } = require('../Controllers/PersonalAccessTokensController');
const { getProductCategorie, addProductCategorie, updateProductCategorie } = require('../Controllers/ProductCategoriesController');
const { getProductMealPlan, addProductMealPlan, updateProductMealPlan } = require('../Controllers/ProductMealPlansController');
const { getProduct, addProduct, updateProduct } = require('../Controllers/ProductsController');
const { getProductTypeItem, addProductTypeItem, updateProductTypeItem } = require('../Controllers/ProductTypeItemsController');
const { getProductType, addProductType, updateProductType } = require('../Controllers/ProductTypesController');
const { getProductTypeTimeout, addProductTypeTimeout, updateProductTypeTimeout } = require('../Controllers/ProductTypeTimeoutsControllers');
const { getQueryResponseAttachment, addQueryResponseAttachment, updateQueryResponseAttachment } = require('../Controllers/QueryResponseAttachmentsController');
const { getUserAddresses, addUserAddresses, updateUserAddresses } = require('../Controllers/UserAddressesController');
const { getUserBusinessCharge, addUserBusinessCharge, updateUserBusinessCharge } = require('../Controllers/UserBusinessChargesControllers');
const { getUserBusiness, addUserBusiness, updateUserBusiness } = require('../Controllers/UserBusinessesController');
const { getUserBusinessOffer, addUserBusinessOffer, updateUserBusinessOffer } = require('../Controllers/UserBusinessOffersController');
const { getUserBusinessSetting, addUserBusinessSetting, updateUserBusinessSetting } = require('../Controllers/UserBusinessSettingsController');
const { getUserDeviceToken, addUserDeviceToken, updateUserDeviceToken } = require('../Controllers/UserDeviceTokensController');
const { getUserExecutives, addUserExecutives, updateUserExecutives } = require('../Controllers/UserExecutivesController');
const { getUserFavourite, addUserFavourite, updateUserFavourite } = require('../Controllers/UserFavouritesController');
const { getUserNotification, addUserNotification, updateUserNotification } = require('../Controllers/UserNotificationsController');
const { getUserQueryResponse, addUserQueryResponse, updateUserQueryResponse } = require('../Controllers/UserQueryResponsesController');
const { getUserReview, addUserReview, updateUserReview } = require('../Controllers/UserReviewController');
const { getUser, addUser, updateUser } = require('../Controllers/UsersController');
const { getSubscriptionDeliverySchedule, addSubscriptionDeliverySchedule, updateSubscriptionDeliverySchedule } = require('../Controllers/UserSubscriptionDeliverySchedulesController');
const { getUserSubscription, addUserSubscription, updateUserSubscription } = require('../Controllers/UserSubscriptionsController');
const { getUserWallet, addUserWallet, updateUserWallet } = require('../Controllers/UserWalletsController');
const { getHistoryTransaction, addHistoryTransaction, updateHistoryTransaction } = require('../Controllers/WalletHistoryTransactionsController');

const router = require('express').Router();


// attr_admin_offers routes
router.route('/admin_offer').post(getAdminOffer);
router.route('/add_admin_offer').post(addAdminOffer);
router.route('/update_admin_offer').post(updateAdminOffer);

// attr_admin_settings routes
router.route('/admin_setting').post(getAdminSettings);
router.route('/add_admin_setting').post(addAdminSettings);
router.route('/update_admin_setting').post(updateAdminSetting);

//   attr_general_pages routes
router.route('/general_page').post(getGeneralPages);
router.route('/add_general_page').post(addGeneralPages);
router.route('/update_general_page').post(updateGeneralPages);

//   faqs routes
router.route('/faq').post(getFaq);
router.route('/add_faq').post(addFaq);
router.route('/update_faq').post(updateFaq);

//   orders routes
router.route('/order').post(getOrder);
router.route('/add_order').post(addOrder);
router.route('/update_order').post(updateOrder);

//   order_payments routes
router.route('/order_payments').post(getOrderPayments);
router.route('/add_order_payments').post(addOrderPayments);
router.route('/update_order_payments').post(updateOrderPayments);


//   order_product_types routes
router.route('/order_product_types').post(getOrderProductType);
router.route('/add_order_product_types').post(addOrderProductType);
router.route('/update_order_product_types').post(updateOrderProductType);

//   personal_access_tokens routes
router.route('/personal_access_tokens').post(getPersonalAccessToken);
router.route('/add_personal_access_tokens').post(addPersonalAccessToken);
router.route('/update_personal_access_tokens').post(updatePersonalAccessToken);


//   products routes
router.route('/product').post(getProduct);
router.route('/add_product').post(addProduct);
router.route('/update_product').post(updateProduct);


//   product_categories routes
router.route('/product_categories').post(getProductCategorie);
router.route('/add_product_categories').post(addProductCategorie);
router.route('/update_product_categories').post(updateProductCategorie);


//   product_meal_plans routes
router.route('/product_meal_plan').post(getProductMealPlan);
router.route('/add_product_meal_plan').post(addProductMealPlan);
router.route('/update_product_meal_plan').post(updateProductMealPlan);


//   product_types routes
router.route('/product_type').post(getProductType);
router.route('/add_product_type').post(addProductType);
router.route('/update_product_type').post(updateProductType);


//   product_type_items routes
router.route('/product_type_item').post(getProductTypeItem);
router.route('/add_product_type_item').post(addProductTypeItem);
router.route('/update_product_type_item').post(updateProductTypeItem);


//   product_type_timeouts routes
router.route('/product_type_timeout').post(getProductTypeTimeout);
router.route('/add_product_type_timeout').post(addProductTypeTimeout);
router.route('/update_product_type_timeout').post(updateProductTypeTimeout);


//   user_addresses routes
router.route('/user_address').post(getUserAddresses);
router.route('/add_user_address').post(addUserAddresses);
router.route('/update_user_address').post(updateUserAddresses);


//   user_businesses routes
router.route('/user_business').post(getUserBusiness);
router.route('/add_user_business').post(addUserBusiness);
router.route('/update_user_business').post(updateUserBusiness);


//   user_business_charges routes
router.route('/user_business_charge').post(getUserBusinessCharge);
router.route('/add_user_business_charge').post(addUserBusinessCharge);
router.route('/update_user_business_charge').post(updateUserBusinessCharge);


//   user_business_offers routes
router.route('/user_business_offer').post(getUserBusinessOffer);
router.route('/add_user_business_offer').post(addUserBusinessOffer);
router.route('/update_user_business_offer').post(updateUserBusinessOffer);


//   user_business_settings routes
router.route('/user_business_settings').post(getUserBusinessSetting);
router.route('/add_user_business_settings').post(addUserBusinessSetting);
router.route('/update_user_business_settings').post(updateUserBusinessSetting);


//   user_device_tokens routes
router.route('/user_device_token').post(getUserDeviceToken);
router.route('/add_user_device_token').post(addUserDeviceToken);
router.route('/update_user_device_token').post(updateUserDeviceToken);


//   user_executives routes
router.route('/user_executive').post(getUserExecutives);
router.route('/add_user_executive').post(addUserExecutives);
router.route('/update_user_executive').post(updateUserExecutives);


//   user_executive_device_tokens routes
router.route('/executive_device_tokens').post(getExecutiveDeviceToken);
router.route('/add_executive_device_tokens').post(addExecutiveDeviceToken);
router.route('/update_executive_device_tokens').post(updateExecutiveDeviceToken);


//   user_executive_notifications routes
router.route('/executive_notification').post(getExecutiveNotification);
router.route('/add_executive_notification').post(addExecutiveNotification);
router.route('/update_executive_notification').post(updateExecutiveNotification);


//   user_favourites routes
router.route('/user_favourites').post(getUserFavourite);
router.route('/add_user_favourites').post(addUserFavourite);
router.route('/update_user_favourites').post(updateUserFavourite);


//   user_notifications routes
router.route('/user_notification').post(getUserNotification);
router.route('/add_user_notification').post(addUserNotification);
router.route('/update_user_notification').post(updateUserNotification);


//   user_query_responses routes
router.route('/user_query_response').post(getUserQueryResponse);
router.route('/add_user_query_response').post(addUserQueryResponse);
router.route('/update_user_query_response').post(updateUserQueryResponse);


//   user_query_response_attachments routes
router.route('/query_response_attachment').post(getQueryResponseAttachment);
router.route('/add_query_response_attachment').post(addQueryResponseAttachment);
router.route('/update_query_response_attachment').post(updateQueryResponseAttachment);


//   user_review_and_ratings routes
router.route('/user_review').post(getUserReview);
router.route('/add_user_review').post(addUserReview);
router.route('/update_user_review').post(updateUserReview);


//   user_subscriptions routes
router.route('/user_subscription').post(getUserSubscription);
router.route('/add_user_subscription').post(addUserSubscription);
router.route('/update_user_subscription').post(updateUserSubscription);

//   user_subscription_delivery_schedules routes
router.route('/subscription_delivery_schedules').post(getSubscriptionDeliverySchedule);
router.route('/add_subscription_delivery_schedules').post(addSubscriptionDeliverySchedule);
router.route('/update_subscription_delivery_schedules').post(updateSubscriptionDeliverySchedule);


//   user_wallets routes
router.route('/user_wallet').post(getUserWallet);
router.route('/add_user_wallet').post(addUserWallet);
router.route('/update_user_wallet').post(updateUserWallet);


//   user_wallet_history_transactions routes
router.route('/wallet_history_transaction').post(getHistoryTransaction);
router.route('/add_wallet_history_transaction').post(addHistoryTransaction);
router.route('/update_wallet_history_transaction').post(updateHistoryTransaction);

//   users routes
router.route('/users').post(getUser);
router.route('/add_users').post(addUser);
router.route('/update_users').post(updateUser);


//   attr_state_districts routes
router.route('/state_districts').post(getStateDistrict);


module.exports = router;
