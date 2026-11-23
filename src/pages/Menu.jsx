import { motion } from "framer-motion";
import { Plus, MoreVertical, Pencil } from "lucide-react";
import { useState } from "react";

const menuItems = [
  // 🍛 MAIN COURSE — 6 ITEMS
  {
    name: "Chicken Biryani",
    description: "Aromatic basmati rice with tender chicken",
    price: "₹280",
    category: "Main Course",
    image: "https://www.cubesnjuliennes.com/wp-content/uploads/2020/07/Chicken-Biryani-Recipe.jpg",
    available: true,
  },
  
  {
    name: "Butter Chicken",
    description: "Chicken in rich creamy tomato gravy",
    price: "₹320",
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop",
    available: true,
  },
  {
    name: "Paneer Butter Masala",
    description: "Paneer cubes in buttery masala gravy",
    price: "₹260",
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop",
    available: true,
  },
  {
    name: "Veg Biryani",
    description: "Spiced rice with fresh vegetables",
    price: "₹220",
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop",
    available: true,
  },
  {
    name: "Dal Makhani",
    description: "Slow-cooked lentils with cream",
    price: "₹210",
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop",
    available: true,
  },
  {
    name: "Masala Dosa",
    description: "Crispy dosa with potato masala",
    price: "₹160",
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop",
    available: true,
  },

  // 🥗 STARTERS — 6 ITEMS
  {
    name: "Paneer Tikka",
    description: "Grilled paneer with Indian spices",
    price: "₹240",
    category: "Starters",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop",
    available: true,
  },
  {
    name: "Chicken Tikka",
    description: "Smoky grilled chicken pieces",
    price: "₹280",
    category: "Starters",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop",
    available: true,
  },
  {
    name: "Samosa",
    description: "Crispy pastry with spiced potato",
    price: "₹60",
    category: "Starters",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop",
    available: true,
  },
  {
    name: "French Fries",
    description: "Golden crispy salted fries",
    price: "₹120",
    category: "Starters",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop",
    available: true,
  },
  {
    name: "Veg Spring Rolls",
    description: "Crunchy rolls stuffed with vegetables",
    price: "₹150",
    category: "Starters",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop",
    available: true,
  },
  {
    name: "Chicken Wings",
    description: "Crispy wings tossed in spicy sauce",
    price: "₹260",
    category: "Starters",
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&auto=format&fit=crop",
    available: true,
  },

  // 🥤 BEVERAGES — 6 ITEMS
  {
    name: "Fresh Lime Soda",
    description: "Refreshing lime with sparkling soda",
    price: "₹90",
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop",
    available: true,
  },
  {
    name: "Masala Chai",
    description: "Indian tea brewed with aromatic spices",
    price: "₹60",
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop",
    available: true,
  },
  {
    name: "Cold Coffee",
    description: "Chilled creamy coffee",
    price: "₹140",
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop",
    available: true,
  },
  {
    name: "Mango Smoothie",
    description: "Thick smoothie made with ripe mango",
    price: "₹150",
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&auto=format&fit=crop",
    available: true,
  },
  {
    name: "Chocolate Milkshake",
    description: "Creamy chocolate blended milkshake",
    price: "₹170",
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop",
    available: true,
  },
  {
    name: "Orange Juice",
    description: "Fresh and citrusy orange juice",
    price: "₹110",
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop",
    available: true,
  },

  // 🍰 DESSERTS — 6 ITEMS
  {
    name: "Gulab Jamun",
    description: "Soft milk dumplings in sweet syrup",
    price: "₹100",
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1666190094760-9a2a5c0c0c96?w=600&auto=format&fit=crop",
    available: true,
  },
  {
    name: "Chocolate Brownie",
    description: "Rich chocolate brownie",
    price: "₹160",
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=600&auto=format&fit=crop",
    available: true,
  },
  {
    name: "Cheesecake",
    description: "Creamy cheesecake with a biscuit base",
    price: "₹190",
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop",
    available: true,
  },
  {
    name: "Chocolate Cake",
    description: "Moist chocolate cake with ganache",
    price: "₹180",
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop",
    available: true,
  },
  {
    name: "Ice Cream",
    description: "Creamy scoops of vanilla ice cream",
    price: "₹100",
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop",
    available: true,
  },
  {
    name: "Waffles",
    description: "Golden waffles with sweet toppings",
    price: "₹200",
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop",
    available: true,
  },
];

function Menu() {
  const [category, setCategory] = useState("All");

  const filteredItems =
    category === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === category);

  return (
    <div className="page">

      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p className="eyebrow">MENU MANAGEMENT</p>

          <h1>Menu</h1>

          <p className="subtitle">
            Manage your restaurant's food items and categories.
          </p>
        </div>

        <button className="primary-btn">
          <Plus size={18} />
          Add Item
        </button>
      </motion.div>

      <div className="menu-controls">

        <div className="menu-tabs">
          {["All", "Main Course", "Starters", "Beverages", "Desserts"].map(
            (item) => (
              <button
                key={item}
                className={category === item ? "selected" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            )
          )}
        </div>

      </div>

      <div className="menu-grid">

        {filteredItems.map((item, index) => (

          <motion.div
            className="menu-card"
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >

            <div className="menu-image-wrapper">

              <img
                src={item.image}
                alt={item.name}
                className="menu-image"
              />

              <span className="category-badge">
                {item.category}
              </span>

            </div>

            <div className="menu-card-content">

              <div className="menu-title-row">
                <div>
                  <h3>{item.name}</h3>

                  <p>{item.description}</p>
                </div>

                <button className="more-btn">
                  <MoreVertical size={19} />
                </button>
              </div>

              <div className="menu-bottom">

                <strong>{item.price}</strong>

                <span className="availability">
                  <span className="available-dot"></span>
                  Available
                </span>

              </div>

              <button className="edit-item">
                <Pencil size={14} />
                Edit
              </button>

            </div>

          </motion.div>

        ))}

      </div>

    </div>
  );
}

export default Menu;