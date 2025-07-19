
import {
  // AudioWaveform,
  // BookOpen,
  // Bot,
  // Command,
  // Frame,
  GalleryVerticalEnd,
  // Map,
  // PieChart,
  // Settings2,
  // SquareTerminal,
  User
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { store } from "@/stores"
import { useLocation } from "react-router-dom"
import { useState } from "react"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const state = store.getState();

  const location = useLocation()
  const [navItems] = useState(() => {
    const initiaNav = [
      {
        title: "QL Thành viên",
        url: "#",
        icon: User,
        isActive: true,
        items: [
          {
            title: "QL nhóm thành viên",
            url: "/user_catalogues",
          },
          {
            title: "QL thành viên",
            url: "/users",
          },
          {
            title: "QL quyền",
            url: "/permissions",
          },
        ],
      },
      {
        title: "QL  bài viết",
        url: "#",
        icon: User,
        isActive: true,
        items: [
          {
            title: "QL nhóm bài viết",
            url: "/post_catalogues",
          },
          {
            title: "QL bài viết",
            url: "/posts",
          },
        ],
      },
      {
        title: "QL sản phẩm",
        url: "#",
        icon: User,
        isActive: true,
        items: [
          {
            title: "QL nhóm sản phẩm",
            url: "/product_catalogues",
          },
          {
            title: "QL sản phẩm",
            url: "/products",
          },
          {
            title: "QL thương hiệu",
            url: "/brands",
          },
        ],
      },
      {
        title: "QL thuộc tính",
        url: "#",
        icon: User,
        isActive: true,
        items: [
          {
            title: "QL nhóm thuộc tính",
            url: "/attribute_catalogues",
          },
          {
            title: "QL thuộc tính",
            url: "/attributes",
          },

        ],
      },
      {
        title: "QL slides",
        url: "#",
        icon: User,
        isActive: true,
        items: [
          {
            title: "QL Banner",
            url: "/slides",
          },

        ],
      },
      {
        title: "QL khuyến mãi",
        url: "#",
        icon: User,
        isActive: true,
        items: [
          {
            title: "QL nhóm khuyến mãi",
            url: "/promotion_catalogues",
          },
          {
            title: "QL khuyến mãi",
            url: "/promotions",
          },
        ],
      },
      {
        title: "QL đơn hàng",
        url: "#",
        icon: User,
        isActive: true,
        items: [
          {
            title: "Tất cả đơn hàng",
            url: "/orders",
          },
          {
            title: "Đơn hàng đã thanh toán",
            url: "/orders?status=paid",
          },
          {
            title: "Đơn hàng đang chờ",
            url: "/orders?status=pending",
          },
          {
            title: "Đơn Cod",
            url: "/orders?paymentMethod=cod",
          },
          {
            title: "Đơn Paypal",
            url: "/orders?paymentMethod=paypal",
          },
        ],
      },
    ]

    return initiaNav.map((nav) => {
      const isActive = nav.items.some(item => location.pathname.startsWith(item.url))
      return {
        ...nav,
        isActive
      }
    })
  })



  const data = {
    user: {
      name: state.auth.user?.name ?? '',
      email: state.auth.user?.email ?? '',
      avatar: state.auth.user?.image ?? '/avatars/shadcn.jpg/'
    },
    teams: [
      {
        name: "Dashboard",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />

      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
